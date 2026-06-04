using Microsoft.AspNetCore.Mvc;
using RMS.Infrastructure.Repositories;
using RMS.Application.DTOs;
using RMS.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace RMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductRepository _repository;
        private readonly IApplicationDbContext _context;

        public ProductController(ProductRepository repository, IApplicationDbContext context)
        {
            _repository = repository;
            _context = context;
        }

        [HttpGet("scan/{scancode}")]
        public async Task<ActionResult<BarcodeScanResponse>> ScanProduct(
            string scancode, 
            [FromQuery] long companyId = 1, 
            [FromQuery] string? mobileNumber = null,
            [FromQuery] long? currentPurId = null)
        {
            if (string.IsNullOrEmpty(scancode))
            {
                return BadRequest(new { message = "Invalid Scancode provided." });
            }

            try
            {
                var result = await _repository.GetProductByScancodeAsync(scancode);
                
                if (result == null)
                {
                    return NotFound(new { message = "Product not found in inventory." });
                }

                // Calculate available stock excluding current invoice if present
                var query = _context.PurchaseTrns.AsNoTracking();
                if (currentPurId.HasValue && currentPurId.Value > 0)
                {
                    query = query.Where(t => t.PurtPurId != currentPurId.Value);
                }

                decimal stockDebit = 0;
                decimal stockCredit = 0;

                var barcodeId = result.BarcodeId;
                var sourceBarcode = result.BarcodeSourceBarcode;

                // Query 1: By barcode ID
                var totals1 = await query
                    .Where(t => t.PurtBarcodeId == barcodeId)
                    .Select(t => new { Debit = t.PurtDebitQty, Credit = t.PurtCreditQty })
                    .ToListAsync();

                stockDebit += totals1.Sum(x => x.Debit ?? 0);
                stockCredit += totals1.Sum(x => x.Credit ?? 0);

                // Query 2: By source code where Barcode ID is null
                if (!string.IsNullOrEmpty(sourceBarcode))
                {
                    var totals2 = await query
                        .Where(t => t.PurtBarcodeId == null && t.PurtSourcecode == sourceBarcode)
                        .Select(t => new { Debit = t.PurtDebitQty, Credit = t.PurtCreditQty })
                        .ToListAsync();

                    stockDebit += totals2.Sum(x => x.Debit ?? 0);
                    stockCredit += totals2.Sum(x => x.Credit ?? 0);
                }

                result.AvailableStock = stockDebit - stockCredit;

                // If product has an HSN code, lookup the applicable GST tax rates
                if (result.HsnId.HasValue && result.HsnId.Value > 0)
                {
                    bool isInterstate = false;
                    if (!string.IsNullOrEmpty(mobileNumber))
                    {
                        var cust = await _context.Customers.FirstOrDefaultAsync(c => c.CustomerMobileNo == mobileNumber);
                        if (cust != null && !string.IsNullOrEmpty(cust.CustomerGstNo) && cust.CustomerGstNo.Length >= 2)
                        {
                            string custStateCode = cust.CustomerGstNo.Substring(0, 2);
                            var companyProfile = await _context.CompanyProfiles.FirstOrDefaultAsync(c => c.CompanyId == companyId);
                            string compStateCode = "";
                            if (companyProfile != null)
                            {
                                if (!string.IsNullOrEmpty(companyProfile.CompanyGstCode))
                                {
                                    compStateCode = companyProfile.CompanyGstCode;
                                }
                                else if (!string.IsNullOrEmpty(companyProfile.ComapnyGstinNo) && companyProfile.ComapnyGstinNo.Length >= 2)
                                {
                                    compStateCode = companyProfile.ComapnyGstinNo.Substring(0, 2);
                                }
                            }

                            if (!string.IsNullOrEmpty(compStateCode) && custStateCode != compStateCode)
                            {
                                isInterstate = true;
                            }
                        }
                    }

                    // Retrieve dynamic tax details using HSN slab calculation
                    var tax = await SalesController.GetTaxForProductAsync(
                        _context, 
                        result.HsnId.Value, 
                        result.BarcodeSelPrice, 
                        DateTime.UtcNow, 
                        isInterstate, 
                        companyId);

                    if (tax != null)
                    {
                        result.TaxId = tax.TaxId;
                        result.TaxRate = tax.TaxRate;
                        result.TaxDesc = tax.TaxDescription;
                    }
                    else
                    {
                        result.TaxDesc = "GST 0%";
                        result.TaxRate = 0;
                    }
                }
                else
                {
                    result.TaxDesc = "GST 0%";
                    result.TaxRate = 0;
                }

                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "An internal error occurred during scan.", details = ex.Message });
            }
        }

        [HttpGet("tax-rate")]
        public async Task<IActionResult> GetTaxRate(
            [FromQuery] string barcode,
            [FromQuery] decimal price,
            [FromQuery] long companyId = 1,
            [FromQuery] bool isInterstate = false)
        {
            try
            {
                var bd = await _context.BarcodeDetails.FirstOrDefaultAsync(b => b.BarcodeDesc == barcode || b.BarcodeSourceBarcode == barcode);
                var pm = bd != null ? await _context.ProductMasters.FirstOrDefaultAsync(p => p.ProductId == bd.BarcodeProductId) : null;

                if (pm != null && pm.ProductHsnId.HasValue && pm.ProductHsnId.Value > 0)
                {
                    var tax = await SalesController.GetTaxForProductAsync(
                        _context,
                        pm.ProductHsnId.Value,
                        price,
                        DateTime.UtcNow,
                        isInterstate,
                        companyId);

                    if (tax != null)
                    {
                        return Ok(new { taxId = tax.TaxId, taxRate = tax.TaxRate, taxDesc = tax.TaxDescription });
                    }
                }
                return Ok(new { taxId = (long?)null, taxRate = 0, taxDesc = "GST 0%" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
