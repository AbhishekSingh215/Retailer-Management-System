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

    [HttpGet("salesmen")]
    public async Task<IActionResult> GetSalesmen()
    {
        var salesmen = await _context.Salesmen
            .Where(s => s.SalesmanDeActive != true)
            .OrderBy(s => s.SalesmanName)
            .Select(s => new
            {
                id = s.SalesmanId,
                name = s.SalesmanName,
                code = s.SalesmanCode
            })
            .ToListAsync();
        return Ok(salesmen);
    }

    [HttpGet("payment-types")]
    public async Task<IActionResult> GetPaymentTypes()
    {
        var types = await _context.PaymentTypes
            .AsNoTracking()
            .OrderBy(p => p.PaymentTypeId)
            .Select(p => new
            {
                id = p.PaymentTypeId,
                name = p.PaymentTypeName
            })
            .ToListAsync();
        return Ok(types);
    }

    [HttpGet("next-docno")]
    public async Task<IActionResult> GetNextDocNo([FromQuery] long companyId = 1, [FromQuery] long companyCount = 1)
    {
        var maxDocNo = await _context.Purchases
            .AsNoTracking()
            .Where(p => p.PurCompanyId == companyId && p.PurCompanyCount == companyCount && p.PurType == DocTypeConstants.SalesInvoice && !p.IsDeleted)
            .OrderByDescending(p => p.PurDocno)
            .Select(p => p.PurDocno)
            .FirstOrDefaultAsync() ?? 0;

        return Ok(new { nextDocNo = maxDocNo + 1 });
    }

    [HttpGet("history")]
    public async Task<IActionResult> GetHistory(
        [FromQuery] long companyId = 1, 
        [FromQuery] long companyCount = 1,
        [FromQuery] string? searchTerm = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var query = from p in _context.Purchases.AsNoTracking()
                    where p.PurCompanyId == companyId && p.PurCompanyCount == companyCount && p.PurType == DocTypeConstants.SalesInvoice && !p.IsDeleted
                    join c in _context.Customers on p.PurCustomerId equals c.CustomerId into custGroup
                    from c in custGroup.DefaultIfEmpty()
                    select new { p, c };

        if (!string.IsNullOrWhiteSpace(searchTerm)) 
        {
            var search = searchTerm.ToLower();
            bool isNumeric = long.TryParse(search, out long searchDocNo);
            
            query = query.Where(x => 
                (isNumeric && x.p.PurDocno == searchDocNo) || 
                (x.c != null && x.c.CustomerName.ToLower().Contains(search)) ||
                (x.c != null && x.c.CustomerMobileNo.Contains(search)) ||
                (x.p.PurBillNo != null && x.p.PurBillNo.Contains(search))
            );
        }

        var totalRecords = await query.CountAsync();

        var rawHistory = await query
            .OrderByDescending(x => x.p.PurDocno)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new
            {
                x.p.PurDocno,
                x.p.PurDocDate,
                x.p.PurComments,
                x.p.PurBillNo,
                x.p.PurVerify,
                x.p.PurStatus,
                x.p.PurId,
                x.p.PurGrossAmount,
                x.p.PurNetAmount,
                x.p.PurTotalQty,
                CustomerName = x.c != null ? x.c.CustomerName : null,
                CustomerMobile = x.c != null ? x.c.CustomerMobileNo : null
            })
            .ToListAsync();

        var history = rawHistory.Select(x => new
        {
            docNo = x.PurDocno,
            docDate = x.PurDocDate.HasValue ? x.PurDocDate.Value.ToString("yyyy-MM-dd") : DateTime.UtcNow.ToString("yyyy-MM-dd"),
            customerName = x.CustomerName ?? x.PurComments ?? "Walk-in Customer",
            mobileNumber = x.CustomerMobile ?? x.PurBillNo ?? "",
            status = (x.PurStatus != "Draft") ? "LOCKED" : "EDIT",
            purId = x.PurId,
            grossAmount = x.PurGrossAmount ?? 0,
            netAmount = x.PurNetAmount ?? 0,
            totalQty = x.PurTotalQty ?? 0
        }).ToList();

        return Ok(new 
        { 
            data = history, 
            totalRecords,
            page,
            pageSize,
            hasMore = (page * pageSize) < totalRecords
        });
    }

    [HttpGet("{purId}")]
    public async Task<IActionResult> GetInvoice(long purId)
    {
        var header = await _context.Purchases.FirstOrDefaultAsync(p => p.PurId == purId && !p.IsDeleted);
        if (header == null) return NotFound(new { message = "Invoice not found." });

        var cust = header.PurCustomerId.HasValue ? await _context.Customers.FirstOrDefaultAsync(c => c.CustomerId == header.PurCustomerId.Value) : null;
        var salesman = header.PurSalesmanId.HasValue ? await _context.Salesmen.FirstOrDefaultAsync(s => s.SalesmanId == header.PurSalesmanId.Value) : null;

        var trns = await _context.PurchaseTrns
            .Where(t => t.PurtPurId == purId)
            .ToListAsync();

        // Bulk load all related entities to solve the N+1 query problem and prevent timeouts
        var barcodeIds = trns.Where(t => t.PurtBarcodeId.HasValue && t.PurtBarcodeId.Value > 0).Select(t => t.PurtBarcodeId.GetValueOrDefault()).Distinct().ToList();
        var sourceCodes = trns.Where(t => !t.PurtBarcodeId.HasValue || t.PurtBarcodeId.Value <= 0).Where(t => !string.IsNullOrEmpty(t.PurtSourcecode)).Select(t => t.PurtSourcecode).Distinct().ToList();

        var barcodes = await _context.BarcodeDetails
            .Where(b => (b.BarcodeId.HasValue && barcodeIds.Contains(b.BarcodeId.Value)) || sourceCodes.Contains(b.BarcodeSourceBarcode))
            .ToListAsync();

        var barcodeDict = barcodes.Where(b => b.BarcodeId.HasValue).GroupBy(b => b.BarcodeId.GetValueOrDefault()).ToDictionary(g => g.Key, g => g.First());
        var barcodeSourceDict = barcodes.Where(b => !string.IsNullOrEmpty(b.BarcodeSourceBarcode)).GroupBy(b => b.BarcodeSourceBarcode!).ToDictionary(g => g.Key, g => g.First());

        var productIds = barcodes.Select(b => b.BarcodeProductId).Where(id => id.HasValue).Select(id => id.GetValueOrDefault()).Distinct().ToList();
        var colorIds = barcodes.Select(b => b.BarcodeColorId).Where(id => id.HasValue).Select(id => id.GetValueOrDefault()).Distinct().ToList();

        var products = await _context.ProductMasters
            .Where(p => productIds.Contains(p.ProductId))
            .ToListAsync();

        var colors = await _context.Colors
            .Where(c => colorIds.Contains(c.ColorId))
            .ToListAsync();

        var categoryIds = products.Select(p => p.ProductCtId).Where(id => id.HasValue).Select(id => id.GetValueOrDefault()).Distinct().ToList();
        var hsnIds = products.Select(p => p.ProductHsnId).Where(id => id.HasValue).Select(id => id.GetValueOrDefault()).Distinct().ToList();

        var categories = await _context.Categories
            .Where(c => categoryIds.Contains(c.CategoryId))
            .ToListAsync();

        var hsns = await _context.Hsns
            .Where(h => hsnIds.Contains(h.HsnId))
            .ToListAsync();

        var taxIds = trns.Where(t => t.PurtTaxId.HasValue).Select(t => t.PurtTaxId.GetValueOrDefault()).Distinct().ToList();
        var taxMasters = await _context.TaxMasters
            .Where(tx => taxIds.Contains(tx.TaxId))
            .ToListAsync();

        var productDict = products.GroupBy(p => p.ProductId).ToDictionary(g => g.Key, g => g.First());
        var categoryDict = categories.GroupBy(c => c.CategoryId).ToDictionary(g => g.Key, g => g.First());
        var colorDict = colors.GroupBy(c => c.ColorId).ToDictionary(g => g.Key, g => g.First());
        var hsnDict = hsns.GroupBy(h => h.HsnId).ToDictionary(g => g.Key, g => g.First());
        var taxDict = taxMasters.GroupBy(tx => tx.TaxId).ToDictionary(g => g.Key, g => g.First());

        // Bulk calculate available stock for all loaded items (excluding current invoice)
        var stockTransactions = await _context.PurchaseTrns
            .AsNoTracking()
            .Where(t => t.PurtPurId != purId) // Exclude current invoice
            .Where(t => (t.PurtBarcodeId.HasValue && barcodeIds.Contains(t.PurtBarcodeId.Value)) 
                     || (!t.PurtBarcodeId.HasValue && t.PurtSourcecode != null && sourceCodes.Contains(t.PurtSourcecode)))
            .Select(t => new {
                BarcodeId = t.PurtBarcodeId,
                SourceCode = t.PurtSourcecode,
                Debit = t.PurtDebitQty ?? 0,
                Credit = t.PurtCreditQty ?? 0
            })
            .ToListAsync();

        var stockByBarcodeId = stockTransactions
            .Where(t => t.BarcodeId.HasValue)
            .GroupBy(t => t.BarcodeId!.Value)
            .ToDictionary(g => g.Key, g => g.Sum(x => x.Debit - x.Credit));

        var stockBySourceCode = stockTransactions
            .Where(t => !t.BarcodeId.HasValue && !string.IsNullOrEmpty(t.SourceCode))
            .GroupBy(t => t.SourceCode!)
            .ToDictionary(g => g.Key, g => g.Sum(x => x.Debit - x.Credit));

        var items = new List<SalesLineItemDto>();
        foreach (var t in trns)
        {
            BarcodeDetail? bd = null;
            if (t.PurtBarcodeId.HasValue && t.PurtBarcodeId.Value > 0)
            {
                barcodeDict.TryGetValue(t.PurtBarcodeId.Value, out bd);
            }
            else if (!string.IsNullOrEmpty(t.PurtSourcecode))
            {
                barcodeSourceDict.TryGetValue(t.PurtSourcecode, out bd);
            }

            ProductMaster? pm = null;
            if (bd != null && bd.BarcodeProductId.HasValue)
            {
                productDict.TryGetValue(bd.BarcodeProductId.Value, out pm);
            }

            Category? cat = null;
            if (pm != null && pm.ProductCtId.HasValue)
            {
                categoryDict.TryGetValue(pm.ProductCtId.Value, out cat);
            }

            Color? col = null;
            if (bd != null && bd.BarcodeColorId.HasValue)
            {
                colorDict.TryGetValue(bd.BarcodeColorId.Value, out col);
            }

            Hsn? hsn = null;
            if (pm != null && pm.ProductHsnId.HasValue)
            {
                hsnDict.TryGetValue(pm.ProductHsnId.Value, out hsn);
            }

            TaxMaster? taxMaster = null;
            if (t.PurtTaxId.HasValue)
            {
                taxDict.TryGetValue(t.PurtTaxId.Value, out taxMaster);
            }

            decimal taxRate = (t.PurtTaxRate1 ?? 0) + (t.PurtTaxRate2 ?? 0);
            string taxDesc = taxMaster?.TaxDescription ?? (taxRate > 0 ? $"GST {taxRate:0.#}%" : "GST 0%");
            decimal taxAmt = (t.PurtTaxAmount1 ?? 0) + (t.PurtTaxAmount2 ?? 0);

            decimal availableStock = 0;
            if (bd != null && bd.BarcodeId.HasValue)
            {
                stockByBarcodeId.TryGetValue(bd.BarcodeId.Value, out availableStock);
            }
            else if (bd != null && !string.IsNullOrEmpty(bd.BarcodeSourceBarcode))
            {
                stockBySourceCode.TryGetValue(bd.BarcodeSourceBarcode, out availableStock);
            }
            else if (!string.IsNullOrEmpty(t.PurtSourcecode))
            {
                stockBySourceCode.TryGetValue(t.PurtSourcecode, out availableStock);
            }

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
                TaxDesc = taxDesc,
                TaxAmt = taxAmt,
                TaxId = t.PurtTaxId,
                TaxRate = taxRate,
                Mrp = t.PurtMrp ?? 0,
                SelPrice = t.PurtSelPrice ?? 0,
                Discount = t.PurtPerDiscount ?? 0,
                PerDiscount = t.PurtDiscAmount ?? 0,
                DiscountPercent = t.PurtDiscountPercent ?? 0,
                Qty = t.PurtCreditQty ?? 0,
                Amount = t.PurtCreditAmount ?? 0,
                IsIndividual = pm?.ProductIndividualBarcode == true,
                IsNoStockChecking = pm?.ProductNoStockChecking == true,
                AvailableStock = availableStock
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
            Remarks = header.PurComments ?? string.Empty,
            GrossAmount = header.PurGrossAmount ?? 0,
            DiscountAmount = header.PurDiscountAmount ?? 0,
            NetAmount = header.PurNetAmount ?? 0,
            TotalQty = header.PurTotalQty ?? 0,
            PurSalesmanId = header.PurSalesmanId,
            SalesmanName = salesman?.SalesmanName ?? "",
            Status = (header.PurStatus != "Draft") ? "LOCKED" : "EDIT",
            PurDiscountPercent = header.PurDiscountPercent,
            PurExclusiveBill = header.PurExclusiveBill,
            PurCreditBill = header.PurCreditBill,
            PurCashAmount = header.PurCashAmount,
            PurCardAmount = header.PurCardAmount,
            PurUpiAmount = header.PurUpiAmount,
            PurAdvanceAmount = header.PurAdvanceAmount,
            PurReceiptAmount = header.PurReceiptAmount,
            Items = items,
            Payments = await _context.PaymentTypes
                .AsNoTracking()
                .Select(pt => new PaymentAmountDto
                {
                    PaymentTypeId = pt.PaymentTypeId,
                    PaymentTypeName = pt.PaymentTypeName,
                    Amount = pt.PaymentTypeName.ToLower().Contains("cash") ? (header.PurCashAmount ?? 0) :
                             pt.PaymentTypeName.ToLower().Contains("card") ? (header.PurCardAmount ?? 0) :
                             pt.PaymentTypeName.ToLower().Contains("upi") ? (header.PurUpiAmount ?? 0) :
                             pt.PaymentTypeName.ToLower().Contains("advance") ? (header.PurAdvanceAmount ?? 0) :
                             pt.PaymentTypeName.ToLower().Contains("bank") ? (header.PurReceiptAmount ?? 0) : 0
                })
                .ToListAsync()
        });
    }

    [HttpPost]
    public async Task<IActionResult> SaveInvoice([FromBody] SalesInvoiceDto request)
    {
        try
        {
            if (request == null) return BadRequest(new { message = "Invalid request payload." });

            long userId = 0;
            var nameIdentifierClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(nameIdentifierClaim) && long.TryParse(nameIdentifierClaim, out long parsedUserId))
            {
                userId = parsedUserId;
            }

            if (request.Items == null || !request.Items.Any())
            {
                return BadRequest(new { success = false, message = "Cannot save an invoice with no items." });
            }

            // Group items by Barcode / SourceCode for validation
            var groupedItems = request.Items
                .Where(i => !string.IsNullOrEmpty(i.Barcode) || !string.IsNullOrEmpty(i.SourceCode))
                .GroupBy(i => string.IsNullOrEmpty(i.Barcode) ? i.SourceCode : i.Barcode)
                .ToList();

            if (groupedItems.Any())
            {
                var barcodeKeys = groupedItems.Select(g => g.Key).ToList();
                
                // Fetch all BarcodeDetails in one query
                var bds = await _context.BarcodeDetails
                    .Where(b => barcodeKeys.Contains(b.BarcodeDesc) || barcodeKeys.Contains(b.BarcodeSourceBarcode))
                    .ToListAsync();

                
                var barcodeProductIds = bds.Select(b => b.BarcodeProductId).Where(id => id.HasValue).Select(id => id.Value).Distinct().ToList();

                // Fetch all ProductMasters in one query
                var pms = await _context.ProductMasters
                    .Where(p => barcodeProductIds.Contains(p.ProductId))
                    .ToListAsync();

                var pmDict = pms.ToDictionary(p => p.ProductId);

                // Fetch all stock transactions in one query (excluding current invoice if present)
                var bdIds = bds.Where(b => b.BarcodeId.HasValue).Select(b => b.BarcodeId!.Value).Distinct().ToList();
                var sourceCodes = bds.Where(b => !string.IsNullOrEmpty(b.BarcodeSourceBarcode)).Select(b => b.BarcodeSourceBarcode!).Distinct().ToList();

                var stockQuery = _context.PurchaseTrns.AsNoTracking();
                if (request.PurId > 0)
                {
                    stockQuery = stockQuery.Where(t => t.PurtPurId != request.PurId);
                }

                var stockTransactions = await stockQuery
                    .Where(t => (t.PurtBarcodeId.HasValue && bdIds.Contains(t.PurtBarcodeId.Value)) 
                             || (!t.PurtBarcodeId.HasValue && t.PurtSourcecode != null && sourceCodes.Contains(t.PurtSourcecode)))
                    .Select(t => new {
                        BarcodeId = t.PurtBarcodeId,
                        SourceCode = t.PurtSourcecode,
                        Debit = t.PurtDebitQty ?? 0,
                        Credit = t.PurtCreditQty ?? 0
                    })
                    .ToListAsync();

                // Calculate available stock per item in memory
                var stockByBarcodeId = stockTransactions
                    .Where(t => t.BarcodeId.HasValue)
                    .GroupBy(t => t.BarcodeId!.Value)
                    .ToDictionary(g => g.Key, g => g.Sum(x => x.Debit - x.Credit));

                var stockBySourceCode = stockTransactions
                    .Where(t => !t.BarcodeId.HasValue && !string.IsNullOrEmpty(t.SourceCode))
                    .GroupBy(t => t.SourceCode!)
                    .ToDictionary(g => g.Key, g => g.Sum(x => x.Debit - x.Credit));

                foreach (var group in groupedItems)
                {
                    var key = group.Key;
                    var bd = bds.FirstOrDefault(b => b.BarcodeDesc == key || b.BarcodeSourceBarcode == key);
                    if (bd == null)
                    {
                        return BadRequest(new { success = false, message = $"Product barcode '{key}' not found in inventory." });
                    }

                    ProductMaster? pm = null;
                    if (bd.BarcodeProductId.HasValue)
                    {
                        pmDict.TryGetValue(bd.BarcodeProductId.Value, out pm);
                    }

                    if (pm == null)
                    {
                        return BadRequest(new { success = false, message = $"Product master not found for barcode '{key}'." });
                    }

                    bool isIndividual = pm.ProductIndividualBarcode == true;
                    bool isNoStockChecking = pm.ProductNoStockChecking == true;

                    if (isIndividual)
                    {
                        if (group.Any(i => i.Qty != 1))
                        {
                            return BadRequest(new { success = false, message = $"Quantity for individual barcode '{key}' must be exactly 1." });
                        }

                        var totalQtyInCart = group.Sum(i => i.Qty);
                        if (totalQtyInCart > 1)
                        {
                            return BadRequest(new { success = false, message = $"Individual barcode '{key}' cannot be added more than once (Total: {totalQtyInCart})." });
                        }
                    }
                    else if (!isNoStockChecking)
                    {
                        decimal availableStock = 0;
                        if (bd.BarcodeId.HasValue)
                        {
                            stockByBarcodeId.TryGetValue(bd.BarcodeId.Value, out availableStock);
                        }
                        else if (!string.IsNullOrEmpty(bd.BarcodeSourceBarcode))
                        {
                            stockBySourceCode.TryGetValue(bd.BarcodeSourceBarcode, out availableStock);
                        }

                        var totalRequestedQty = group.Sum(i => i.Qty);
                        if (totalRequestedQty > availableStock)
                        {
                            return BadRequest(new {
                                success = false,
                                message = $"Insufficient stock for product '{bd.BarcodeDesc}'. Only {availableStock} units are available, but you requested {totalRequestedQty} units.",
                                details = $"Product: {pm.ProductCode} | Available: {availableStock} | Requested: {totalRequestedQty}"
                            });
                        }
                    }
                }
            }

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
                    p.PurDocno == request.DocNo &&
                    !p.IsDeleted);
            }

            var companyProfile = await _context.CompanyProfiles.AsNoTracking().FirstOrDefaultAsync(c => c.CompanyId == request.CompanyId);
            string locationStr = companyProfile?.CompanyLocation.ToString() ?? "100";
            if (string.IsNullOrEmpty(locationStr))
            {
                locationStr = "100";
            }

            bool isNew = false;
            if (header == null)
            {
                isNew = true;

                long maxPurId = _context.GetMaxPknolocation("Purchase", locationStr, "PurId", "PurLocation", "PurMaxPkno");
                long maxPurPkNo = 0;
                string maxPurIdStr = maxPurId.ToString();
                if (maxPurIdStr.StartsWith(locationStr) && maxPurIdStr.Length > locationStr.Length)
                {
                    maxPurPkNo = long.Parse(maxPurIdStr.Substring(locationStr.Length));
                }

                header = new Purchase
                {
                    PurId = maxPurId,
                    PurMaxPkno = maxPurPkNo,
                    PurCompanyId = request.CompanyId,
                    PurCompanyCount = request.CompanyCount,
                    PurType = DocTypeConstants.SalesInvoice, // Sales FormType
                    PurDocno = request.DocNo,
                    PurLocation = companyProfile?.CompanyLocation,
                    PurRecordCreated = DateTime.UtcNow,
                    PurUserNewId = userId
                };
                _context.Purchases.Add(header);
            }

            if (header != null && (!header.PurMaxPkno.HasValue || header.PurMaxPkno.Value == 0) && header.PurLocation.HasValue)
            {
                string loc = header.PurLocation.Value.ToString();
                string purIdStr = header.PurId.ToString();
                if (purIdStr.StartsWith(loc) && purIdStr.Length > loc.Length)
                {
                    header.PurMaxPkno = long.Parse(purIdStr.Substring(loc.Length));
                }
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
                    long maxCustomerId = await _context.Customers
                        .AsNoTracking()
                        .OrderByDescending(c => c.CustomerId)
                        .Select(c => c.CustomerId)
                        .FirstOrDefaultAsync();

                    cust = new Customer
                    {
                        CustomerId = maxCustomerId + 1,
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
            header.PurSupplierId = header.PurSupplierId ?? 0;
            header.PurDocDate = parsedDate;
            header.PurComments = string.IsNullOrWhiteSpace(request.Remarks) ? request.CustomerName : request.Remarks;
            header.PurBillNo = ""; // Set to empty string or null as per request (not customer mobile no anymore)
            header.PurSalesmanId = request.PurSalesmanId;
            header.PurStatus = request.Status == "LOCKED" ? "Completed" : "Draft";
            header.PurExclusiveBill = request.PurExclusiveBill ?? false;
            header.PurCreditBill = request.PurCreditBill ?? false;
            header.PurDiscountPercent = request.PurDiscountPercent ?? 0;
            header.PurLastModified = userId;
            header.PurRecordModified = DateTime.UtcNow;
            if (request.Payments != null && request.Payments.Any())
            {
                header.PurCashAmount = 0;
                header.PurCardAmount = 0;
                header.PurUpiAmount = 0;
                header.PurAdvanceAmount = 0;
                header.PurReceiptAmount = 0;

                foreach (var p in request.Payments)
                {
                    var name = p.PaymentTypeName.ToLower();
                    if (name.Contains("cash")) header.PurCashAmount = p.Amount;
                    else if (name.Contains("card")) header.PurCardAmount = p.Amount;
                    else if (name.Contains("upi")) header.PurUpiAmount = p.Amount;
                    else if (name.Contains("advance")) header.PurAdvanceAmount = p.Amount;
                    else if (name.Contains("bank")) header.PurReceiptAmount = p.Amount;
                }
            }
            else
            {
                header.PurCashAmount = request.PurCashAmount;
                header.PurCardAmount = request.PurCardAmount;
                header.PurUpiAmount = request.PurUpiAmount;
                header.PurAdvanceAmount = request.PurAdvanceAmount;
                header.PurReceiptAmount = request.PurReceiptAmount;
            }
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
            decimal totalCgst = 0;
            decimal totalSgst = 0;
            decimal totalIgst = 0;
            decimal totalQty = 0;
            decimal grossAmount = 0;
            decimal discountAmount = 0;

            // Determine customer location for interstate IGST vs local CGST/SGST
            bool isInterstate = false;
            if (cust != null && !string.IsNullOrEmpty(cust.CustomerGstNo) && cust.CustomerGstNo.Length >= 2)
            {
                string custStateCode = cust.CustomerGstNo.Substring(0, 2);
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

            long startPurtId = _context.GetMaxPknolocation("PurchaseTrn", locationStr, "PurtId", "PurtLocation", "PurtMaxPkno");
            long startPurtPkNo = 1;
            string startPurtIdStr = startPurtId.ToString();
            if (startPurtIdStr.StartsWith(locationStr) && startPurtIdStr.Length > locationStr.Length)
            {
                startPurtPkNo = long.Parse(startPurtIdStr.Substring(locationStr.Length));
            }
            else
            {
                startPurtPkNo = startPurtId;
            }

            int itemIndex = 0;
            foreach (var item in request.Items)
            {
                long currentPurtPkNo = startPurtPkNo + itemIndex;
                long nextPurtId = startPurtIdStr.StartsWith(locationStr) ? long.Parse(locationStr + currentPurtPkNo.ToString()) : currentPurtPkNo;
                itemIndex++;

                var bd = await _context.BarcodeDetails.FirstOrDefaultAsync(b => b.BarcodeDesc == item.Barcode || b.BarcodeSourceBarcode == item.Barcode);
                var pm = bd != null ? await _context.ProductMasters.FirstOrDefaultAsync(p => p.ProductId == bd.BarcodeProductId) : null;

                decimal taxInclusiveUnitPrice = item.SelPrice - item.Discount;
                decimal taxInclusiveAmount = taxInclusiveUnitPrice * item.Qty;

                // Lookup HSN and TaxMaster details
                TaxMaster? tax = null;
                if (pm != null && pm.ProductHsnId.HasValue && pm.ProductHsnId.Value > 0)
                {
                    tax = await GetTaxForProductAsync(
                        _context, 
                        pm.ProductHsnId.Value, 
                        taxInclusiveUnitPrice, 
                        parsedDate, 
                        isInterstate, 
                        request.CompanyId);
                }

                decimal taxamount1 = 0;
                decimal taxamount2 = 0;
                decimal taxRate1 = 0;
                decimal taxRate2 = 0;

                if (tax != null)
                {
                    if (tax.TaxCgst.HasValue && tax.TaxCgst.Value > 0)
                    {
                        taxRate1 = tax.TaxCgst.Value;
                        taxRate2 = tax.TaxSgst ?? 0;
                    }
                    else if (tax.TaxIgst.HasValue && tax.TaxIgst.Value > 0)
                    {
                        taxRate1 = tax.TaxIgst.Value;
                        taxRate2 = 0;
                    }
                }

                decimal totalTaxRate = taxRate1 + taxRate2;
                decimal baseAmount = taxInclusiveAmount / (1 + totalTaxRate / 100);
                decimal totalTax = taxInclusiveAmount - baseAmount;

                if (totalTaxRate > 0)
                {
                    taxamount1 = Math.Round(totalTax * (taxRate1 / totalTaxRate), 4);
                    taxamount2 = Math.Round(totalTax * (taxRate2 / totalTaxRate), 4);

                    if (taxRate2 > 0)
                    {
                        totalCgst += taxamount1;
                        totalSgst += taxamount2;
                    }
                    else
                    {
                        totalIgst += taxamount1;
                    }
                }

                grossAmount += item.Mrp * item.Qty;
                discountAmount += item.Discount * item.Qty;
                totalQty += item.Qty;

                var trn = new PurchaseTrn
                {
                    PurtId = nextPurtId,
                    PurtMaxPkno = currentPurtPkNo,
                    PurtPurId = header.PurId,
                    Purtsdocno = 0,
                    PurtOrderBy = 1,
                    PurtProductId = bd?.BarcodeProductId ?? 0,
                    PurtColorId = bd?.BarcodeColorId ?? 0,
                    PurtSizeId = bd?.BarcodeSizeId ?? 0,
                    PurtSubSizeId = bd?.BarcodeSubSizeId ?? 0,
                    PurtLocation = companyProfile?.CompanyLocation,
                    PurtBarcodeId = bd?.BarcodeId,
                    PurtSize = item.Size,
                    PurtSourcecode = item.SourceCode,
                    PurtRemarks = null,
                    PurtMrp = item.Mrp,
                    PurtSelPrice = item.SelPrice,
                    PurtDiscAmount = item.PerDiscount,
                    PurtDebitQty = 0,
                    PurtCreditQty = item.Qty,
                    PurtCreditAmount = baseAmount,
                    PurtHsnId = pm?.ProductHsnId,
                    PurtTaxId = tax?.TaxId,
                    PurtTaxRate1 = taxRate1,
                    PurtTaxRate2 = taxRate2,
                    PurtTaxAmount1 = taxamount1,
                    PurtTaxAmount2 = taxamount2,
                    PurtPurchaseRate = item.Mrp, // Rate matches Mrp in POS
                    PurtPerDiscount = item.Discount,
                    PurtDiscountPercent = item.DiscountPercent ?? 0,
                    PurtCostRate = bd?.BarcodeRate ?? 0,
                    PurtPerQty = 0,
                    PurtDebitAmount = 0,
                    PurtParentId = 0,
                    PurtReverseTaxAmount1 = 0,
                    PurtReverseTaxAmount2 = 0,
                    PurtMiddleMrp = 0,
                    PurtMiddleSelPrice = 0,
                    PurtSizeFrom = "",
                    PurtSizeTo = "",
                    PurtSizeMiddle = "",
                    PurtSelPriceDiscPercent = 0,
                    PurtRateDiff = 0,
                    PurtMrpDiff = 0,
                    PurtMarkDown = false,
                    PurtMarkDownPercent = 0,
                    PurtSalesmanId = header.PurSalesmanId ?? 0,
                    PurtRecordCreated = DateTime.UtcNow,
                    PurtRecordModified = DateTime.UtcNow
                };
                _context.PurchaseTrns.Add(trn);
            }

            // Update header totals
            decimal totalAmountAfterRowDiscount = request.Items.Sum(i => (i.SelPrice - i.PerDiscount) * i.Qty);
            decimal billDiscountAmount = 0;
            if (header.PurDiscountPercent.HasValue && header.PurDiscountPercent.Value > 0)
            {
                billDiscountAmount = Math.Round((totalAmountAfterRowDiscount * header.PurDiscountPercent.Value) / 100, 2);
            }

            header.PurGrossAmount = grossAmount;
            header.PurDiscountAmount = billDiscountAmount;
            header.PurTotalQty = totalQty;
            header.PurCgstAmount = totalCgst;
            header.PurSgstAmount = totalSgst;
            header.PurIgstAmount = totalIgst;

            decimal rawNetAmount = request.Items.Sum(i => (i.SelPrice - i.Discount) * i.Qty);
            decimal roundedNetAmount = Math.Round(rawNetAmount);
            header.PurRoundoff = roundedNetAmount - rawNetAmount;
            header.PurNetAmount = roundedNetAmount;

            // Remove existing Receipts if updating
            var existingReceipts = await _context.Receipts.Where(r => r.ReceiptRefPurId == header.PurId).ToListAsync();
            if (existingReceipts.Any())
            {
                _context.Receipts.RemoveRange(existingReceipts);
                await _context.SaveChangesAsync();
            }

            // Gather payments to process
            var paymentsToProcess = new List<(long PaymentTypeId, decimal Amount)>();
            if (request.Payments != null && request.Payments.Any())
            {
                foreach (var p in request.Payments)
                {
                    if (p.Amount > 0)
                    {
                        paymentsToProcess.Add((p.PaymentTypeId, p.Amount));
                    }
                }
            }
            else
            {
                var paymentTypes = await _context.PaymentTypes.ToListAsync();
                var cashType = paymentTypes.FirstOrDefault(t => t.PaymentTypeName.ToLower().Contains("cash"));
                var cardType = paymentTypes.FirstOrDefault(t => t.PaymentTypeName.ToLower().Contains("card"));
                var upiType = paymentTypes.FirstOrDefault(t => t.PaymentTypeName.ToLower().Contains("upi"));
                var advanceType = paymentTypes.FirstOrDefault(t => t.PaymentTypeName.ToLower().Contains("advance"));
                var bankType = paymentTypes.FirstOrDefault(t => t.PaymentTypeName.ToLower().Contains("bank") || t.PaymentTypeName.ToLower().Contains("receipt"));

                if (request.PurCashAmount.GetValueOrDefault() > 0 && cashType != null) paymentsToProcess.Add((cashType.PaymentTypeId, request.PurCashAmount.GetValueOrDefault()));
                if (request.PurCardAmount.GetValueOrDefault() > 0 && cardType != null) paymentsToProcess.Add((cardType.PaymentTypeId, request.PurCardAmount.GetValueOrDefault()));
                if (request.PurUpiAmount.GetValueOrDefault() > 0 && upiType != null) paymentsToProcess.Add((upiType.PaymentTypeId, request.PurUpiAmount.GetValueOrDefault()));
                if (request.PurAdvanceAmount.GetValueOrDefault() > 0 && advanceType != null) paymentsToProcess.Add((advanceType.PaymentTypeId, request.PurAdvanceAmount.GetValueOrDefault()));
                if (request.PurReceiptAmount.GetValueOrDefault() > 0 && bankType != null) paymentsToProcess.Add((bankType.PaymentTypeId, request.PurReceiptAmount.GetValueOrDefault()));
            }

            if (paymentsToProcess.Any())
            {
                long startReceiptId = _context.GetMaxPknolocation("Receipt", locationStr, "ReceiptId", "ReceiptLocation", "ReceiptMaxPkno");
                long startReceiptPkNo = 1;
                string startReceiptIdStr = startReceiptId.ToString();
                if (startReceiptIdStr.StartsWith(locationStr) && startReceiptIdStr.Length > locationStr.Length)
                {
                    startReceiptPkNo = long.Parse(startReceiptIdStr.Substring(locationStr.Length));
                }
                else
                {
                    startReceiptPkNo = startReceiptId;
                }

                int receiptIndex = 0;
                foreach (var p in paymentsToProcess)
                {
                    long currentReceiptPkNo = startReceiptPkNo + receiptIndex;
                    long nextReceiptId = startReceiptIdStr.StartsWith(locationStr) ? long.Parse(locationStr + currentReceiptPkNo.ToString()) : currentReceiptPkNo;
                    receiptIndex++;

                    var subType = await _context.PaymentSubTypes.FirstOrDefaultAsync(st => st.PaymentSubTypePaymentId == p.PaymentTypeId);
                    long paymentSubTypeId = subType?.PaymentSubTypeId ?? 0;

                    var receipt = new Receipt
                    {
                        ReceiptId = nextReceiptId,
                        ReceiptCompanyId = header.PurCompanyId,
                        ReceiptCompanyCount = header.PurCompanyCount,
                        ReceiptType = 1, // Sales
                        ReceiptLocation = companyProfile?.CompanyLocation,
                        ReceiptDocno = header.PurDocno,
                        ReceiptDocDate = parsedDate,
                        ReceiptCustomerId = cust?.CustomerId,
                        ReceiptAmount = p.Amount,
                        ReceiptAdjustAmount = p.Amount,
                        ReceiptRecordCreated = DateTime.UtcNow,
                        ReceiptRecordModified = DateTime.UtcNow,
                        ReceiptUserNewId = userId,
                        ReceiptLastModified = userId,
                        ReceiptMaxPkno = currentReceiptPkNo,
                        ReceiptRefPurId = header.PurId,
                        ReceiptAdjustDate = parsedDate,
                        ReceiptPaymentSubTypeId = paymentSubTypeId,
                        ReceiptAdvanceId = 0,
                        ReceiptReturnId = 0,
                        ReceiptIsAdvance = false,
                        ReceiptLedgerId = 0,
                        ReceiptIsExpense = false,
                        ReceiptDirection = 1,
                        ReceiptNotes = null,
                        ReceiptTransferGroupId = 0
                    };
                    _context.Receipts.Add(receipt);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, purId = header.PurId, docNo = header.PurDocno, message = "Invoice saved successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message, details = ex.InnerException?.Message });
        }
    }

    public static async Task<TaxMaster?> GetTaxForProductAsync(
        IApplicationDbContext context, 
        long hsnId, 
        decimal basePrice, 
        DateTime docDate, 
        bool isInterstate, 
        long companyId)
    {
        var companyProfile = await context.CompanyProfiles.FirstOrDefaultAsync(c => c.CompanyId == companyId);
        if (companyProfile?.CompanyGstType == 0 || companyProfile?.CompanyGstType == 1)
        {
            var zeroTax = await context.TaxMasters.FirstOrDefaultAsync(t => t.TaxRate == 0 && t.TaxType == 2);
            if (zeroTax != null)
            {
                return zeroTax;
            }
        }

        var dates = await context.HsnDetails
            .Where(hd => hd.HsdHsnId == hsnId && (hd.HsdWefDate == null || hd.HsdWefDate >= docDate))
            .OrderBy(hd => hd.HsdWefDate)
            .Select(hd => hd.HsdWefDate)
            .Distinct()
            .ToListAsync();

        DateTime? applicableDate = null;
        if (dates.Any())
        {
            applicableDate = dates.First();
        }
        else
        {
            applicableDate = await context.HsnDetails
                .Where(hd => hd.HsdHsnId == hsnId && hd.HsdWefDate != null && hd.HsdWefDate <= docDate)
                .OrderByDescending(hd => hd.HsdWefDate)
                .Select(hd => hd.HsdWefDate)
                .FirstOrDefaultAsync();
        }

        var slabs = await context.HsnDetails
            .Where(hd => hd.HsdHsnId == hsnId && hd.HsdWefDate == applicableDate)
            .OrderBy(hd => hd.HsdId)
            .ToListAsync();

        if (!slabs.Any()) return null;

        long taxId = 0;

        if (slabs.Count > 1)
        {
            bool found = false;
            foreach (var slab in slabs)
            {
                decimal slabAmount = slab.HsdSlabAmount;
                long taxRateId = isInterstate ? slab.HsdSlabTax2 : slab.HsdSlabTax1;

                var tax = await context.TaxMasters.FirstOrDefaultAsync(t => t.TaxId == taxRateId);
                decimal testBasePrice = basePrice;

                if (tax != null && tax.TaxRate > 0)
                {
                    if (basePrice > slabAmount && slabAmount != 0)
                    {
                        testBasePrice = basePrice / (1 + ((tax.TaxRate ?? 0) / 100));
                    }
                }

                bool isMatching = false;
                if (slabAmount == 0 && testBasePrice > slabAmount)
                {
                    isMatching = true;
                }
                else if (testBasePrice <= slabAmount)
                {
                    isMatching = true;
                }

                if (isMatching && !found)
                {
                    taxId = taxRateId;
                    found = true;
                }
            }
        }
        else
        {
            taxId = isInterstate ? slabs[0].HsdSlabTax2 : slabs[0].HsdSlabTax1;
        }

        if (taxId > 0)
        {
            return await context.TaxMasters.FirstOrDefaultAsync(t => t.TaxId == taxId);
        }

        return null;
    }
}

