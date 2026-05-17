using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RMS.Application.DTOs;
using RMS.Application.Interfaces;
using RMS.Application.Constants;
using RMS.Core.Entities;

namespace RMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public SalesController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("next-docno")]
    public async Task<IActionResult> GetNextDocNo([FromQuery] long companyId = 1, [FromQuery] long companyCount = 1)
    {
        var maxDocNo = await _context.Purchases
            .Where(p => p.PurCompanyId == companyId && p.PurCompanyCount == companyCount && p.PurType == DocTypeConstants.SalesInvoice)
            .MaxAsync(p => (long?)p.PurDocno) ?? 0;

        return Ok(new { nextDocNo = maxDocNo + 1 });
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory([FromQuery] long companyId = 1, [FromQuery] long companyCount = 1)
    {
        var history = await (from p in _context.Purchases
                             where p.PurCompanyId == companyId && p.PurCompanyCount == companyCount && p.PurType == DocTypeConstants.SalesInvoice && !p.IsDeleted
                             join c in _context.Customers on p.PurCustomerId equals c.CustomerId into custGroup
                             from c in custGroup.DefaultIfEmpty()
                             orderby p.PurDocno descending
                             select new
                             {
                                 docNo = p.PurDocno,
                                 docDate = p.PurDocDate.HasValue ? p.PurDocDate.Value.ToString("yyyy-MM-dd") : DateTime.UtcNow.ToString("yyyy-MM-dd"),
                                 customerName = c != null ? c.CustomerName : (p.PurComments ?? "Walk-in Customer"),
                                 mobileNumber = c != null ? (c.CustomerMobileNo ?? "") : (p.PurBillNo ?? ""),
                                 status = p.PurVerify == true ? "LOCKED" : "EDIT",
                                 purId = p.PurId,
                                 grossAmount = p.PurGrossAmount ?? 0,
                                 netAmount = p.PurNetAmount ?? 0,
                                 totalQty = p.PurTotalQty ?? 0
                             }).ToListAsync();

        return Ok(history);
    }

    [HttpGet("{purId}")]
    public async Task<IActionResult> GetInvoice(long purId)
    {
        var header = await _context.Purchases.FirstOrDefaultAsync(p => p.PurId == purId && !p.IsDeleted);
        if (header == null) return NotFound(new { message = "Invoice not found." });

        var cust = header.PurCustomerId.HasValue ? await _context.Customers.FirstOrDefaultAsync(c => c.CustomerId == header.PurCustomerId.Value) : null;

        var trns = await _context.PurchaseTrns
            .Where(t => t.PurtPurId == purId)
            .ToListAsync();

        var items = new List<SalesLineItemDto>();
        foreach (var t in trns)
        {
            BarcodeDetail? bd = null;
            if (t.PurtBarcodeId.HasValue && t.PurtBarcodeId.Value > 0)
            {
                bd = await _context.BarcodeDetails.FirstOrDefaultAsync(b => b.BarcodeId == t.PurtBarcodeId.Value);
            }
            else if (!string.IsNullOrEmpty(t.PurtSourcecode))
            {
                bd = await _context.BarcodeDetails.FirstOrDefaultAsync(b => b.BarcodeSourceBarcode == t.PurtSourcecode);
            }

            var pm = bd != null ? await _context.ProductMasters.FirstOrDefaultAsync(p => p.ProductId == bd.BarcodeProductId) : null;
            var cat = pm != null ? await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == pm.ProductCtId) : null;
            var col = bd != null ? await _context.Colors.FirstOrDefaultAsync(c => c.ColorId == bd.BarcodeColorId) : null;
            var hsn = pm != null && pm.ProductHsnId.HasValue ? await _context.Hsns.FirstOrDefaultAsync(h => h.HsnId == pm.ProductHsnId.Value) : null;

            items.Add(new SalesLineItemDto
            {
                Id = t.PurtId.ToString(),
                Barcode = bd?.BarcodeDesc?.ToString() ?? t.PurtSourcecode ?? "",
                SourceCode = bd?.BarcodeSourceBarcode ?? t.PurtSourcecode ?? "",
                ProductCode = pm?.ProductCode ?? t.PurtRemarks ?? "",
                Color = col?.ColorName ?? "N/A",
                Size = bd?.BarcodeSize ?? t.PurtSize ?? "Free",
                Category = cat?.CategoryDescription ?? "General",
                Hsn = hsn?.HsnCode ?? "9999",
                TaxDesc = "GST 5%",
                TaxAmt = (t.PurtCreditAmount ?? 0) * 0.05m,
                Mrp = t.PurtMrp ?? 0,
                SelPrice = t.PurtSelPrice ?? 0,
                Discount = t.PurtDiscAmount ?? 0,
                Qty = t.PurtCreditQty ?? 0,
                Amount = t.PurtCreditAmount ?? 0
            });
        }

        return Ok(new SalesInvoiceDto
        {
            PurId = header.PurId,
            CompanyId = header.PurCompanyId ?? 1,
            CompanyCount = header.PurCompanyCount ?? 1,
            DocNo = header.PurDocno ?? 1,
            DocDate = header.PurDocDate.HasValue ? header.PurDocDate.Value.ToString("yyyy-MM-dd") : DateTime.UtcNow.ToString("yyyy-MM-dd"),
            CustomerName = cust != null ? cust.CustomerName : (header.PurComments ?? "Walk-in Customer"),
            MobileNumber = cust != null ? (cust.CustomerMobileNo ?? "") : (header.PurBillNo ?? ""),
            GrossAmount = header.PurGrossAmount ?? 0,
            DiscountAmount = header.PurDiscountAmount ?? 0,
            NetAmount = header.PurNetAmount ?? 0,
            TotalQty = header.PurTotalQty ?? 0,
            Status = header.PurVerify == true ? "LOCKED" : "EDIT",
            Items = items
        });
    }

    [HttpPost]
    public async Task<IActionResult> SaveInvoice([FromBody] SalesInvoiceDto request)
    {
        if (request == null) return BadRequest(new { message = "Invalid request payload." });

        // Parse Date
        DateTime parsedDate = DateTime.UtcNow;
        if (!string.IsNullOrEmpty(request.DocDate))
        {
            DateTime.TryParse(request.DocDate, out parsedDate);
        }

        Purchase? header = null;

        if (request.PurId > 0)
        {
            header = await _context.Purchases.FirstOrDefaultAsync(p => p.PurId == request.PurId);
        }
        else
        {
            header = await _context.Purchases.FirstOrDefaultAsync(p => 
                p.PurCompanyId == request.CompanyId && 
                p.PurCompanyCount == request.CompanyCount && 
                p.PurType == DocTypeConstants.SalesInvoice && 
                p.PurDocno == request.DocNo);
        }

        bool isNew = false;
        if (header == null)
        {
            isNew = true;
            header = new Purchase
            {
                PurCompanyId = request.CompanyId,
                PurCompanyCount = request.CompanyCount,
                PurType = DocTypeConstants.SalesInvoice, // Sales FormType
                PurDocno = request.DocNo,
                PurRecordCreated = DateTime.UtcNow
            };
            _context.Purchases.Add(header);
        }

        Customer? cust = null;
        if (!string.IsNullOrEmpty(request.MobileNumber))
        {
            cust = await _context.Customers.FirstOrDefaultAsync(c => c.CustomerMobileNo == request.MobileNumber);
            if (cust != null)
            {
                if (!string.IsNullOrEmpty(request.CustomerName) && cust.CustomerName != request.CustomerName)
                {
                    cust.CustomerName = request.CustomerName;
                    cust.CustomerRecordModified = DateTime.UtcNow;
                }
            }
            else
            {
                cust = new Customer
                {
                    CustomerName = string.IsNullOrEmpty(request.CustomerName) ? "Walk-in Customer" : request.CustomerName,
                    CustomerMobileNo = request.MobileNumber,
                    CustomerRecordCreated = DateTime.UtcNow,
                    CustomerIsLedger = false,
                    CustomerTimeStamp = new byte[8]
                };
                _context.Customers.Add(cust);
                await _context.SaveChangesAsync();
            }
        }

        header.PurCustomerId = cust?.CustomerId;
        header.PurDocDate = parsedDate;
        header.PurComments = request.CustomerName; // Keep as fallback / comment
        header.PurBillNo = request.MobileNumber;   // Keep as fallback / billno
        header.PurGrossAmount = request.GrossAmount;
        header.PurDiscountAmount = request.DiscountAmount;
        header.PurNetAmount = request.NetAmount;
        header.PurTotalQty = request.TotalQty;
        header.PurVerify = request.Status == "LOCKED";
        header.PurRecordModified = DateTime.UtcNow;

        await _context.SaveChangesAsync(); // Save header to generate PurId if new

        // Remove existing line items
        var existingItems = await _context.PurchaseTrns.Where(t => t.PurtPurId == header.PurId).ToListAsync();
        if (existingItems.Any())
        {
            _context.PurchaseTrns.RemoveRange(existingItems);
            await _context.SaveChangesAsync();
        }

        // Add new line items
        long maxPurtId = await _context.PurchaseTrns.MaxAsync(t => (long?)t.PurtId) ?? 0;

        foreach (var item in request.Items)
        {
            maxPurtId++;
            long.TryParse(item.Barcode, out var barcodeLong);
            var bd = await _context.BarcodeDetails.FirstOrDefaultAsync(b => (barcodeLong > 0 && b.BarcodeDesc == barcodeLong) || b.BarcodeSourceBarcode == item.Barcode);

            var trn = new PurchaseTrn
            {
                PurtId = maxPurtId,
                PurtPurId = header.PurId,
                PurtBarcodeId = bd?.BarcodeId,
                PurtSize = item.Size,
                PurtSourcecode = item.SourceCode,
                PurtRemarks = item.ProductCode,
                PurtMrp = item.Mrp,
                PurtSelPrice = item.SelPrice,
                PurtDiscAmount = item.Discount,
                PurtCreditQty = item.Qty,
                PurtCreditAmount = item.Amount,
                PurtRecordCreated = DateTime.UtcNow,
                PurtRecordModified = DateTime.UtcNow
            };
            _context.PurchaseTrns.Add(trn);
        }

        await _context.SaveChangesAsync();

        return Ok(new { success = true, purId = header.PurId, docNo = header.PurDocno, message = "Invoice saved successfully." });
    }
}
