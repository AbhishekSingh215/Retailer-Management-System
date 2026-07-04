using System;
using System.IO;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using Microsoft.Data.SqlClient;
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
    private static readonly System.Collections.Concurrent.ConcurrentDictionary<string, bool> _activeSaves = new();
    private readonly IApplicationDbContext _context;
    private readonly ICrystalReportService _reportService;

    public SalesController(IApplicationDbContext context, ICrystalReportService reportService)
    {
        _context = context;
        _reportService = reportService;
    }

    [HttpGet("debug-connection")]
    public IActionResult DebugConnection()
    {
        var dbContext = (DbContext)_context;
        var connStr = dbContext.Database.GetDbConnection().ConnectionString;
        var builder = new Microsoft.Data.SqlClient.SqlConnectionStringBuilder(connStr);
        return Ok(new 
        { 
            server = builder.DataSource, 
            database = builder.InitialCatalog,
            userId = builder.UserID,
            fullConnectionString = connStr
        });
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
        [FromQuery] int pageSize = 50,
        CancellationToken cancellationToken = default)
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

        var totalRecords = await query.CountAsync(cancellationToken);

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
            .ToListAsync(cancellationToken);

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
    public async Task<IActionResult> GetInvoice(long purId, CancellationToken cancellationToken = default)
    {
        async Task<Purchase?> GetPurchaseHeaderViaSP(long id, CancellationToken ct)
        {
            var dbContext = (DbContext)_context;
            using var command = dbContext.Database.GetDbConnection().CreateCommand();
            command.CommandText = "GetAllPurchase";
            command.CommandType = System.Data.CommandType.StoredProcedure;
            
            var paramPurId = command.CreateParameter();
            paramPurId.ParameterName = "@PurId";
            paramPurId.Value = id;
            command.Parameters.Add(paramPurId);

            var paramCond = command.CreateParameter();
            paramCond.ParameterName = "@WhereCond";
            paramCond.Value = "AND IsDeleted = 0";
            command.Parameters.Add(paramCond);

            if (command.Connection.State != System.Data.ConnectionState.Open)
                await command.Connection.OpenAsync(ct);

            using var reader = await command.ExecuteReaderAsync(ct);
            if (await reader.ReadAsync(ct))
            {
                return new Purchase
                {
                    PurId = Convert.ToInt64(reader["PurId"]),
                    PurCompanyId = reader["PurCompanyId"] != DBNull.Value ? Convert.ToInt64(reader["PurCompanyId"]) : 0,
                    PurCompanyCount = reader["PurCompanyCount"] != DBNull.Value ? Convert.ToInt64(reader["PurCompanyCount"]) : 0,
                    PurType = reader["PurType"] != DBNull.Value ? Convert.ToInt64(reader["PurType"]) : (long?)null,
                    PurDocno = reader["PurDocno"] != DBNull.Value ? Convert.ToInt64(reader["PurDocno"]) : 0,
                    PurDocDate = reader["PurDocDate"] != DBNull.Value ? Convert.ToDateTime(reader["PurDocDate"]) : (DateTime?)null,
                    PurCustomerId = reader["PurCustomerId"] != DBNull.Value ? Convert.ToInt64(reader["PurCustomerId"]) : (long?)null,
                    PurSalesmanId = reader["PurSalesmanId"] != DBNull.Value ? Convert.ToInt64(reader["PurSalesmanId"]) : (long?)null,
                    PurComments = reader["PurComments"]?.ToString(),
                    PurBillNo = reader["PurBillNo"]?.ToString(),
                    PurVerify = reader["PurVerify"] != DBNull.Value ? Convert.ToBoolean(reader["PurVerify"]) : (bool?)null,
                    PurGrossAmount = reader["PurGrossAmount"] != DBNull.Value ? Convert.ToDecimal(reader["PurGrossAmount"]) : (decimal?)null,
                    PurNetAmount = reader["PurNetAmount"] != DBNull.Value ? Convert.ToDecimal(reader["PurNetAmount"]) : (decimal?)null,
                    PurTotalQty = reader["PurTotalQty"] != DBNull.Value ? Convert.ToDecimal(reader["PurTotalQty"]) : (decimal?)null,
                    PurDiscountPercent = reader["PurDiscountPercent"] != DBNull.Value ? Convert.ToDecimal(reader["PurDiscountPercent"]) : (decimal?)null,
                    PurDiscountAmount = reader["PurDiscountAmount"] != DBNull.Value ? Convert.ToDecimal(reader["PurDiscountAmount"]) : (decimal?)null,
                    PurExclusiveBill = reader["PurExclusiveBill"] != DBNull.Value ? Convert.ToBoolean(reader["PurExclusiveBill"]) : (bool?)null,
                    PurCreditBill = reader["PurCreditBill"] != DBNull.Value ? Convert.ToBoolean(reader["PurCreditBill"]) : (bool?)null,
                    // PurCashAmount = reader["PurCashAmount"] != DBNull.Value ? Convert.ToDecimal(reader["PurCashAmount"]) : (decimal?)null,
                    // PurCardAmount = reader["PurCardAmount"] != DBNull.Value ? Convert.ToDecimal(reader["PurCardAmount"]) : (decimal?)null,
                    // PurUpiAmount = reader["PurUpiAmount"] != DBNull.Value ? Convert.ToDecimal(reader["PurUpiAmount"]) : (decimal?)null,
                    // PurAdvanceAmount = reader["PurAdvanceAmount"] != DBNull.Value ? Convert.ToDecimal(reader["PurAdvanceAmount"]) : (decimal?)null,
                    // PurReceiptAmount = reader["PurReceiptAmount"] != DBNull.Value ? Convert.ToDecimal(reader["PurReceiptAmount"]) : (decimal?)null,
                };
            }
            return null;
        }

        async Task<List<PurchaseTrn>> GetPurchaseTrnsViaSP(long id, CancellationToken ct)
        {
            var list = new List<PurchaseTrn>();
            var dbContext = (DbContext)_context;
            using var command = dbContext.Database.GetDbConnection().CreateCommand();
            command.CommandText = "GetPurchaseDetails";
            command.CommandType = System.Data.CommandType.StoredProcedure;
            
            var param = command.CreateParameter();
            param.ParameterName = "@PurtPurID";
            param.Value = id;
            command.Parameters.Add(param);

            if (command.Connection.State != System.Data.ConnectionState.Open)
                await command.Connection.OpenAsync(ct);

            using var reader = await command.ExecuteReaderAsync(ct);
            while (await reader.ReadAsync(ct))
            {
                list.Add(new PurchaseTrn
                {
                    PurtId = Convert.ToInt64(reader["PurtId"]),
                    PurtPurId = Convert.ToInt64(reader["PurtPurId"]),
                    PurtBarcodeId = reader["PurtBarcodeId"] != DBNull.Value ? Convert.ToInt64(reader["PurtBarcodeId"]) : (long?)null,
                    PurtProductId = reader["PurtProductId"] != DBNull.Value ? Convert.ToInt64(reader["PurtProductId"]) : (long?)null,
                    PurtColorId = reader["PurtColorId"] != DBNull.Value ? Convert.ToInt64(reader["PurtColorId"]) : (long?)null,
                    PurtTaxId = reader["PurtTaxId"] != DBNull.Value ? Convert.ToInt32(reader["PurtTaxId"]) : (int?)null,
                    PurtTaxRate1 = reader["PurtTaxRate1"] != DBNull.Value ? Convert.ToDecimal(reader["PurtTaxRate1"]) : (decimal?)null,
                    PurtTaxRate2 = reader["PurtTaxRate2"] != DBNull.Value ? Convert.ToDecimal(reader["PurtTaxRate2"]) : (decimal?)null,
                    PurtTaxAmount1 = reader["PurtTaxAmount1"] != DBNull.Value ? Convert.ToDecimal(reader["PurtTaxAmount1"]) : (decimal?)null,
                    PurtTaxAmount2 = reader["PurtTaxAmount2"] != DBNull.Value ? Convert.ToDecimal(reader["PurtTaxAmount2"]) : (decimal?)null,
                    PurtDebitQty = reader["PurtDebitQty"] != DBNull.Value ? Convert.ToDecimal(reader["PurtDebitQty"]) : (decimal?)null,
                    PurtCreditQty = reader["PurtCreditQty"] != DBNull.Value ? Convert.ToDecimal(reader["PurtCreditQty"]) : (decimal?)null,
                    PurtSelPrice = reader["PurtSelPrice"] != DBNull.Value ? Convert.ToDecimal(reader["PurtSelPrice"]) : (decimal?)null,
                    PurtMrp = reader["PurtMrp"] != DBNull.Value ? Convert.ToDecimal(reader["PurtMrp"]) : (decimal?)null,
                    PurtDiscountPercent = reader["PurtDiscountPercent"] != DBNull.Value ? Convert.ToDecimal(reader["PurtDiscountPercent"]) : (decimal?)null,
                    PurtDiscAmount = reader["PurtDiscAmount"] != DBNull.Value ? Convert.ToDecimal(reader["PurtDiscAmount"]) : (decimal?)null,
                    PurtSize = reader["PurtSize"]?.ToString() ?? "Free",
                    PurtSourcecode = reader["PurtSourcecode"]?.ToString() ?? "",
                    PurtRemarks = reader["PurtRemarks"]?.ToString() ?? "",
                });
            }
            return list;
        }

        var header = await GetPurchaseHeaderViaSP(purId, cancellationToken);
        if (header == null) return NotFound(new { message = "Invoice not found." });

        // Load receipts and payment configurations to calculate correct payment amounts
        var receipts = await _context.Receipts
            .AsNoTracking()
            .Where(r => r.ReceiptRefPurId == purId)
            .ToListAsync(cancellationToken);

        var paymentSubTypes = await _context.PaymentSubTypes
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var paymentTypes = await _context.PaymentTypes
            .AsNoTracking()
            .Select(pt => new { pt.PaymentTypeId, pt.PaymentTypeName })
            .ToListAsync(cancellationToken);

        var cashType = paymentTypes.FirstOrDefault(t => t.PaymentTypeName.ToLower().Contains("cash"));
        var cardType = paymentTypes.FirstOrDefault(t => t.PaymentTypeName.ToLower().Contains("card"));
        var upiType = paymentTypes.FirstOrDefault(t => t.PaymentTypeName.ToLower().Contains("upi"));
        var advanceType = paymentTypes.FirstOrDefault(t => t.PaymentTypeName.ToLower().Contains("advance"));
        var bankType = paymentTypes.FirstOrDefault(t => t.PaymentTypeName.ToLower().Contains("ubank") || t.PaymentTypeName.ToLower().Contains("receipt"));

        var paymentAmounts = receipts
            .GroupBy(r => paymentSubTypes.FirstOrDefault(st => st.PaymentSubTypeId == r.ReceiptPaymentSubTypeId)?.PaymentSubTypePaymentId)
            .Where(g => g.Key.HasValue)
            .ToDictionary(g => g.Key!.Value, g => g.Sum(r => r.ReceiptAmount ?? 0m));

        header.PurCashAmount = cashType != null && paymentAmounts.ContainsKey(cashType.PaymentTypeId) ? paymentAmounts[cashType.PaymentTypeId] : 0;
        header.PurCardAmount = cardType != null && paymentAmounts.ContainsKey(cardType.PaymentTypeId) ? paymentAmounts[cardType.PaymentTypeId] : 0;
        header.PurUpiAmount = upiType != null && paymentAmounts.ContainsKey(upiType.PaymentTypeId) ? paymentAmounts[upiType.PaymentTypeId] : 0;
        header.PurAdvanceAmount = advanceType != null && paymentAmounts.ContainsKey(advanceType.PaymentTypeId) ? paymentAmounts[advanceType.PaymentTypeId] : 0;
        header.PurReceiptAmount = bankType != null && paymentAmounts.ContainsKey(bankType.PaymentTypeId) ? paymentAmounts[bankType.PaymentTypeId] : 0;

        var cust = header.PurCustomerId.HasValue ? await _context.Customers.AsNoTracking().FirstOrDefaultAsync(c => c.CustomerId == header.PurCustomerId.Value, cancellationToken) : null;
        var salesman = header.PurSalesmanId.HasValue ? await _context.Salesmen.AsNoTracking().FirstOrDefaultAsync(s => s.SalesmanId == header.PurSalesmanId.Value, cancellationToken) : null;

        var trns = await GetPurchaseTrnsViaSP(purId, cancellationToken);

        // Bulk load all related entities to solve the N+1 query problem and prevent timeouts
        var barcodeIds = trns.Where(t => t.PurtBarcodeId.HasValue && t.PurtBarcodeId.Value > 0).Select(t => t.PurtBarcodeId.GetValueOrDefault()).Distinct().ToList();
        var sourceCodes = trns.Where(t => !t.PurtBarcodeId.HasValue || t.PurtBarcodeId.Value <= 0).Where(t => !string.IsNullOrEmpty(t.PurtSourcecode)).Select(t => t.PurtSourcecode).Distinct().ToList();

        var barcodesById = await _context.BarcodeDetails
            .AsNoTracking()
            .Where(b => b.BarcodeId.HasValue && barcodeIds.Contains(b.BarcodeId.Value))
            .ToListAsync(cancellationToken);

        var barcodesBySource = sourceCodes.Any() ? await _context.BarcodeDetails
            .AsNoTracking()
            .Where(b => b.BarcodeSourceBarcode != null && sourceCodes.Contains(b.BarcodeSourceBarcode))
            .ToListAsync(cancellationToken) : new List<BarcodeDetail>();

        var barcodes = barcodesById.Concat(barcodesBySource)
            .GroupBy(b => b.BarcodeId)
            .Select(g => g.First())
            .ToList();

        var barcodeDict = barcodes.Where(b => b.BarcodeId.HasValue).GroupBy(b => b.BarcodeId.GetValueOrDefault()).ToDictionary(g => g.Key, g => g.First());
        var barcodeSourceDict = barcodes.Where(b => !string.IsNullOrEmpty(b.BarcodeSourceBarcode)).GroupBy(b => b.BarcodeSourceBarcode!).ToDictionary(g => g.Key, g => g.First());

        var productIds = barcodes.Select(b => b.BarcodeProductId).Where(id => id.HasValue).Select(id => id.GetValueOrDefault()).Distinct().ToList();
        var colorIds = barcodes.Select(b => b.BarcodeColorId).Where(id => id.HasValue).Select(id => id.GetValueOrDefault()).Distinct().ToList();

        var products = await _context.ProductMasters
            .AsNoTracking()
            .Where(p => productIds.Contains(p.ProductId))
            .ToListAsync(cancellationToken);

        var colors = await _context.Colors
            .AsNoTracking()
            .Where(c => colorIds.Contains(c.ColorId))
            .ToListAsync(cancellationToken);

        var categoryIds = products.Select(p => p.ProductCtId).Where(id => id.HasValue).Select(id => id.GetValueOrDefault()).Distinct().ToList();
        var hsnIds = products.Select(p => p.ProductHsnId).Where(id => id.HasValue).Select(id => id.GetValueOrDefault()).Distinct().ToList();

        var categories = await _context.Categories
            .AsNoTracking()
            .Where(c => categoryIds.Contains(c.CategoryId))
            .ToListAsync(cancellationToken);

        var hsns = await _context.Hsns
            .AsNoTracking()
            .Where(h => hsnIds.Contains(h.HsnId))
            .ToListAsync(cancellationToken);

        var taxIds = trns.Where(t => t.PurtTaxId.HasValue).Select(t => t.PurtTaxId.GetValueOrDefault()).Distinct().ToList();
        var taxMasters = await _context.TaxMasters
            .AsNoTracking()
            .Where(tx => taxIds.Contains(tx.TaxId))
            .ToListAsync(cancellationToken);

        var productDict = products.GroupBy(p => p.ProductId).ToDictionary(g => g.Key, g => g.First());
        var categoryDict = categories.GroupBy(c => c.CategoryId).ToDictionary(g => g.Key, g => g.First());
        var colorDict = colors.GroupBy(c => c.ColorId).ToDictionary(g => g.Key, g => g.First());
        var hsnDict = hsns.GroupBy(h => h.HsnId).ToDictionary(g => g.Key, g => g.First());
        var taxDict = taxMasters.GroupBy(tx => tx.TaxId).ToDictionary(g => g.Key, g => g.First());

        // Bulk calculate available stock for all loaded items (excluding current invoice) directly in DB
        var stockByBarcodeId = new Dictionary<long, decimal>();
        var stockBySourceCode = new Dictionary<string, decimal>();

        if (_context is DbContext dbContext)
        {
            using var transaction = await dbContext.Database.BeginTransactionAsync(System.Data.IsolationLevel.ReadUncommitted, cancellationToken);
            try
            {
                if (barcodeIds.Any())
                {
                    var barcodeStockList = await _context.PurchaseTrns
                        .AsNoTracking()
                        .Where(t => t.PurtBarcodeId.HasValue && barcodeIds.Contains(t.PurtBarcodeId.Value) && t.PurtPurId != purId)
                        .GroupBy(t => t.PurtBarcodeId!.Value)
                        .Select(g => new
                        {
                            BarcodeId = g.Key,
                            Stock = g.Sum(t => (t.PurtDebitQty ?? 0m) - (t.PurtCreditQty ?? 0m))
                        })
                        .ToListAsync(cancellationToken);

                    stockByBarcodeId = barcodeStockList.ToDictionary(x => x.BarcodeId, x => x.Stock);
                }

                if (sourceCodes.Any())
                {
                    var sourceStockList = await _context.PurchaseTrns
                        .AsNoTracking()
                        .Where(t => !t.PurtBarcodeId.HasValue && t.PurtSourcecode != null && sourceCodes.Contains(t.PurtSourcecode) && t.PurtPurId != purId)
                        .GroupBy(t => t.PurtSourcecode)
                        .Select(g => new
                        {
                            SourceCode = g.Key,
                            Stock = g.Sum(t => (t.PurtDebitQty ?? 0m) - (t.PurtCreditQty ?? 0m))
                        })
                        .ToListAsync(cancellationToken);

                    stockBySourceCode = sourceStockList
                        .Where(x => x.SourceCode != null)
                        .ToDictionary(x => x.SourceCode!, x => x.Stock);
                }
            }
            finally
            {
                await transaction.RollbackAsync(cancellationToken);
            }
        }

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
    public async Task<IActionResult> SaveInvoice([FromBody] SalesInvoiceDto request, CancellationToken cancellationToken = default)
    {
        if (request == null) return BadRequest(new { message = "Invalid request payload." });

        string saveKey = $"{request.CompanyId}_{request.CompanyCount}_{request.DocNo}";
        if (!_activeSaves.TryAdd(saveKey, true))
        {
            return StatusCode(409, new { success = false, message = "Another save request for this invoice is already in progress. Please wait." });
        }

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

            var bds = new List<BarcodeDetail>();
            var pmDict = new Dictionary<long, ProductMaster>();

            if (groupedItems.Any())
            {
                var barcodeKeys = groupedItems.Select(g => g.Key).ToList();

                // Fetch all BarcodeDetails in one query using separate index-seeking lookups
                var bdsByDesc = await _context.BarcodeDetails
                    .AsNoTracking()
                    .Where(b => barcodeKeys.Contains(b.BarcodeDesc))
                    .ToListAsync();

                var bdsBySource = await _context.BarcodeDetails
                    .AsNoTracking()
                    .Where(b => b.BarcodeSourceBarcode != null && barcodeKeys.Contains(b.BarcodeSourceBarcode))
                    .ToListAsync();

                bds = bdsByDesc.Concat(bdsBySource)
                    .GroupBy(b => b.BarcodeId)
                    .Select(g => g.First())
                    .ToList();

                var barcodeProductIds = bds.Select(b => b.BarcodeProductId).Where(id => id.HasValue).Select(id => id.Value).Distinct().ToList();

                // Fetch all ProductMasters in one query
                var pms = await _context.ProductMasters
                    .Where(p => barcodeProductIds.Contains(p.ProductId))
                    .ToListAsync();

                pmDict = pms.ToDictionary(p => p.ProductId);

                // Fetch all stock transactions directly aggregated in DB (excluding current invoice if present)
                var bdIds = bds.Where(b => b.BarcodeId.HasValue).Select(b => b.BarcodeId!.Value).Distinct().ToList();
                var sourceCodes = bds.Where(b => !string.IsNullOrEmpty(b.BarcodeSourceBarcode)).Select(b => b.BarcodeSourceBarcode!).Distinct().ToList();

                var stockByBarcodeId = new Dictionary<long, decimal>();
                var stockBySourceCode = new Dictionary<string, decimal>();

                if (_context is DbContext dbContextForStock)
                {
                    using var transaction = await dbContextForStock.Database.BeginTransactionAsync(System.Data.IsolationLevel.ReadUncommitted, cancellationToken);
                    try
                    {
                        if (bdIds.Any())
                        {
                            var barcodeStockQuery = _context.PurchaseTrns.AsNoTracking()
                                .Where(t => t.PurtBarcodeId.HasValue && bdIds.Contains(t.PurtBarcodeId.Value));
                            
                            if (request.PurId > 0)
                            {
                                barcodeStockQuery = barcodeStockQuery.Where(t => t.PurtPurId != request.PurId);
                            }

                            var barcodeStockList = await barcodeStockQuery
                                .GroupBy(t => t.PurtBarcodeId!.Value)
                                .Select(g => new {
                                    BarcodeId = g.Key,
                                    Stock = g.Sum(t => (t.PurtDebitQty ?? 0m) - (t.PurtCreditQty ?? 0m))
                                })
                                .ToListAsync(cancellationToken);

                            stockByBarcodeId = barcodeStockList.ToDictionary(x => x.BarcodeId, x => x.Stock);
                        }

                        if (sourceCodes.Any())
                        {
                            var sourceStockQuery = _context.PurchaseTrns.AsNoTracking()
                                .Where(t => !t.PurtBarcodeId.HasValue && t.PurtSourcecode != null && sourceCodes.Contains(t.PurtSourcecode));

                            if (request.PurId > 0)
                            {
                                sourceStockQuery = sourceStockQuery.Where(t => t.PurtPurId != request.PurId);
                            }

                            var sourceStockList = await sourceStockQuery
                                .GroupBy(t => t.PurtSourcecode)
                                .Select(g => new {
                                    SourceCode = g.Key,
                                    Stock = g.Sum(t => (t.PurtDebitQty ?? 0m) - (t.PurtCreditQty ?? 0m))
                                })
                                .ToListAsync(cancellationToken);

                            stockBySourceCode = sourceStockList
                                .Where(x => x.SourceCode != null)
                                .ToDictionary(x => x.SourceCode!, x => x.Stock);
                        }
                    }
                    finally
                    {
                        await transaction.RollbackAsync(cancellationToken);
                    }
                }

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
                header = await _context.Purchases.AsNoTracking().FirstOrDefaultAsync(p => p.PurId == request.PurId);
            }
            else
            {
                header = await _context.Purchases.AsNoTracking().FirstOrDefaultAsync(p =>
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
                    PurType = DocTypeConstants.SalesInvoice,
                    PurDocno = request.DocNo,
                    PurLocation = companyProfile?.CompanyLocation,
                    PurRecordCreated = DateTime.UtcNow,
                    PurUserNewId = userId
                };
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
                }
            }

            header.PurCustomerId = cust?.CustomerId;
            header.PurSupplierId = header.PurSupplierId ?? 0;
            header.PurDocDate = parsedDate;
            header.PurComments = string.IsNullOrWhiteSpace(request.Remarks) ? request.CustomerName : request.Remarks;
            header.PurBillNo = "";
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

            var purchaseTrns = new List<PurchaseTrn>();

            int itemIndex = 0;
            foreach (var item in request.Items)
            {
                long currentPurtPkNo = startPurtPkNo + itemIndex;
                long nextPurtId = startPurtIdStr.StartsWith(locationStr) ? long.Parse(locationStr + currentPurtPkNo.ToString()) : currentPurtPkNo;
                itemIndex++;

                var bd = bds.FirstOrDefault(b => b.BarcodeDesc == item.Barcode || b.BarcodeSourceBarcode == item.Barcode);
                var pm = (bd != null && bd.BarcodeProductId.HasValue && pmDict.ContainsKey(bd.BarcodeProductId.Value)) ? pmDict[bd.BarcodeProductId.Value] : null;

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
                    PurtRate = item.SelPrice - item.PerDiscount,
                    PurtDebitQty = 0,
                    PurtCreditQty = item.Qty,
                    PurtCreditAmount = baseAmount,
                    PurtHsnId = pm?.ProductHsnId,
                    PurtTaxId = tax?.TaxId,
                    PurtTaxRate1 = taxRate1,
                    PurtTaxRate2 = taxRate2,
                    PurtTaxAmount1 = taxamount1,
                    PurtTaxAmount2 = taxamount2,
                    PurtPurchaseRate = item.Mrp,
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
                purchaseTrns.Add(trn);
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

            // Save exactly what the frontend shows on screen — no recalculation needed
            header.PurRoundoff = Math.Round(request.NetAmount) - request.NetAmount;
            header.PurNetAmount = Math.Round(request.NetAmount);

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
                var paymentTypes = await _context.PaymentTypes
                    .Select(t => new { t.PaymentTypeId, t.PaymentTypeName })
                    .ToListAsync(cancellationToken);
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

            // Write all database changes atomically in a transaction block
            var dbContext = (DbContext)_context;
            using var dbTransaction = await dbContext.Database.BeginTransactionAsync();
            try
            {
                // Save customer if modified/new
                if (cust != null)
                {
                    var exists = await _context.Customers.AnyAsync(c => c.CustomerId == cust.CustomerId);
                    if (!exists)
                    {
                        _context.Customers.Add(cust);
                    }
                    await _context.SaveChangesAsync();
                }

                header.PurCustomerId = cust?.CustomerId;

                // Delete existing items & receipts from DB directly (fast)
                await dbContext.Database.ExecuteSqlRawAsync("DELETE FROM PurchaseTrn WHERE PurtPurId = {0}", header.PurId);
                await dbContext.Database.ExecuteSqlRawAsync("DELETE FROM PurchaseChargeTrn WHERE PurcPurId = {0}", header.PurId);
                await dbContext.Database.ExecuteSqlRawAsync("DELETE FROM Receipt WHERE ReceiptRefPurId = {0}", header.PurId);

                // Call stored procedure InsertPurchase
                await SavePurchaseViaSP(header, purchaseTrns);

                // Create receipts if payments exist
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
                    await _context.SaveChangesAsync();
                }

                await dbTransaction.CommitAsync();
            }
            catch (Exception)
            {
                await dbTransaction.RollbackAsync();
                throw;
            }

            return Ok(new { success = true, purId = header.PurId, docNo = header.PurDocno, message = "Invoice saved successfully." });
        }
        catch (Exception ex)
            {
            return StatusCode(500, new { success = false, message = ex.Message, details = ex.InnerException?.Message });
        }
        finally
        {
            _activeSaves.TryRemove(saveKey, out _);
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

    [HttpGet("reports")]
    public async Task<IActionResult> GetReports()
    {
        try
        {
            Console.WriteLine("[CustomReports] GET /api/sales/reports requested.");
            var repHdr = await _context.RepCustoms
                .FirstOrDefaultAsync(r => r.RepDesc != null && r.RepDesc.Trim().ToUpper() == "BILL");

            if (repHdr == null)
            {
                Console.WriteLine("[CustomReports] No header record found for 'BILL'.");
                return Ok(new List<object>());
            }

            Console.WriteLine($"[CustomReports] Found header repNo: {repHdr.RepNo}, repPathName: {repHdr.RepPathName}");

            var reports = await _context.RepCustomTrns
                .Where(t => t.RctRepNo == repHdr.RepNo)
                .OrderBy(t => t.RctOrder)
                .Select(t => new
                {
                    rctNo = t.RctNo,
                    rctDesc = t.RctDesc,
                    rctFileName = t.RctFileName,
                    repPathName = repHdr.RepPathName
                })
                .ToListAsync();

            Console.WriteLine($"[CustomReports] Returning {reports.Count} child report layouts.");
            return Ok(reports);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[CustomReports] Error fetching custom reports: {ex.Message}");
            return StatusCode(500, new { message = "Failed to load custom reports.", error = ex.Message });
        }
    }

    [HttpGet("report/preview/{purId}")]
    public async Task<IActionResult> PreviewReport(long purId, [FromQuery] string? reportPath = null)
    {
        try
        {
            string connectionString = "";
            if (_context is DbContext dbContext)
            {
                connectionString = dbContext.Database.GetDbConnection().ConnectionString;
            }

            if (string.IsNullOrEmpty(connectionString))
            {
                return StatusCode(500, new { message = "Database connection string is not configured in the application context." });
            }

            DataTable salesData = GetSalesDataForReport(purId, connectionString);
            if (salesData.Rows.Count == 0)
            {
                return NotFound(new { message = $"No database records found for PurId: {purId}" });
            }

            DataTable taxData = GetTaxDataForSubreport(purId, connectionString);
            var subreports = new Dictionary<string, DataTable>(StringComparer.OrdinalIgnoreCase)
            {
                { "BillTaxDetailsSubReport", taxData }
            };

            string rptName = string.IsNullOrEmpty(reportPath) ? "Sales-Bill.rpt" : reportPath;
            byte[] pdfBytes = await _reportService.GenerateReportAsync(rptName, salesData, subreports);

            Response.Headers.Add("Content-Disposition", $"inline; filename=SalesBill_{purId}.pdf");
            return File(pdfBytes, "application/pdf");
        }
        catch (FileNotFoundException ex)
        {
            return StatusCode(404, new { message = ex.Message, error = "Template File Not Found" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An unexpected error occurred during preview generation.", error = ex.Message, details = ex.StackTrace });
        }
    }

    private DataTable GetSalesDataForReport(long purId, string connectionString)
    {
        string query = @"
        SELECT 
            PurId AS SalesId, 
            PurDocno AS SalesDocNo, 
            PurDocDate AS SalesDocDate,
            ISNULL(CompanyName, '') AS CompanyName,
            ISNULL(CompanyAddress1, '') AS CompanyAddress1,
            ISNULL(CompanyAddress2, '') AS CompanyAddress2,
            ISNULL(ct.CityName, '') AS CompanyCityName,
            ISNULL(cs.StateName, '') AS CompanyStateName,
            ISNULL(CompanyEmailId, '') AS CompanyEmailId,
            ISNULL(ComapnyGstinNo, '') AS CompanyGstinNo,
            ISNULL(CompanyGstCode, '') AS CompanyGstCode,
            ISNULL(CompanyWhatsappMobileNo, '') AS CompanyWhatsappMobileNo,
            ISNULL(CustomerName, '') AS CustomerName,
            ISNULL(CustomerAddress1, '') AS CustomerAddress1,
            ISNULL(CustomerAddress2, '') AS CustomerAddress2,
            ISNULL(cc.CityName, '') AS CustomerCity,
            ISNULL(csn.StateName, '') AS StateName,
            ISNULL(CustomerEmailId, '') AS CustomerEmailId,
            ISNULL(CustomerMobileNo, '') AS CustomerMobileNo,
            ISNULL(CustomerMobileNo2, '') AS CustomerMobileNo2,
            ISNULL(CustomerGstNo, '') AS CustomerGstNo,
            ISNULL(CustomerPanNo, '') AS CustomerPanNo,
            PurtProductId AS SalesProductId,
            ProductCode,
            ProductDesc,
            ISNULL(ColorCode, '') AS ColorCode,
            ISNULL(ColorName, '') AS ColorName,
            ISNULL(BrandName, '') AS BrandName,
            ISNULL(CategoryCode, '') AS CategoryCode,
            ISNULL(CategoryDescription, '') AS CategoryDescription,
            ISNULL(DeptCode, '') AS DeptCode,
            ISNULL(DeptDescription, '') AS DeptDescription,
            ISNULL(HsnCode, '') AS HsnCode,
            PurtBarcodeId AS SalesBarcodeId,
            Cast(BarcodeDesc As Varchar(15)) as BarcodeDesc,
            BarcodeSourceBarcode,
            ISNULL(PurtPerQty, 0) AS SalesPerQty,
            ISNULL(PurtDebitQty, 0) AS SalesDebitQty,
            ISNULL(PurtCreditQty, 0) AS SalesCreditQty,
            ISNULL(PurtCreditAmount, 0) AS SalesCreditAmount,
            ISNULL(PurtMrp, 0) AS SalesMrp,
            ISNULL(PurtSelPrice, 0) AS SalesSelPrice,
            ISNULL(PurtRate, 0) AS SalesRate,
            ISNULL(PurGrossAmount, 0) AS SalesGrossAmount,
            ISNULL(PurtDiscountPercent, 0) AS SalesDiscountPercent,
            ISNULL(PurtDiscAmount, 0) AS SalesDiscountAmount,
            ISNULL(PurNetAmount, 0) AS SalesNetAmount,
            PurType AS SalesType,
            PurtHsnId AS SalesHsnId,
            ISNULL(TaxDescription, '') AS TaxDescription,
            (CASE TaxType WHEN 1 THEN 'Cgst' WHEN 2 THEN 'Igst' END) AS TaxDesc1,
            (CASE TaxType WHEN 1 THEN 'Sgst' WHEN 2 THEN '' END) AS TaxDesc2,
            PurtTaxRate1 AS SalesTaxRate1,
            PurtTaxRate2 AS SalesTaxRate2,
            PurtTaxAmount1 AS SalesTaxAmount1,
            PurtTaxAmount2 AS SalesTaxAmount2,
            ISNULL(CompanyPincode, '') AS CompanyPincode,
            ISNULL(csn.StateGstcode, '') AS CustomerGstStatecode,
            ISNULL(CompanyPhoneNo, '') AS CompanyPhoneNo,
            ISNULL(CompanyMobileNo, '') AS CompanyMobileNo,
            ISNULL(PurtSize, '') AS SalesSize,
            ISNULL(SizeCode, '') AS SizeCode,
            ISNULL(ProductFromSize, '') AS ProductFromSize,
            ISNULL(ProductToSize, '') AS ProductToSize,
            ISNULL(ProductMiddleSize, '') AS ProductMiddleSize,
            ISNULL((SELECT SUM(ReceiptAdjustAmount) FROM Receipt 
                    LEFT JOIN PaymentSubType ON PaymentSubtypeid = ReceiptPaymentSubTypeId 
                    LEFT JOIN PaymentType ON Paymenttypeid = PaymentSubTypePaymentId 
                    WHERE PaymentTypeName = 'Cash-In-Hand' AND ReceiptRefPurID = PurId AND ReceiptType = 1), 0) AS CashAmount,
            ISNULL((SELECT SUM(ReceiptAdjustAmount) FROM Receipt 
                    LEFT JOIN PaymentSubType ON PaymentSubtypeid = ReceiptPaymentSubTypeId 
                    LEFT JOIN PaymentType ON Paymenttypeid = PaymentSubTypePaymentId 
                    WHERE PaymentTypeName = 'UPI' AND ReceiptRefPurID = PurId AND ReceiptType = 1), 0) AS UpiAmount,
            ISNULL((SELECT SUM(ReceiptAdjustAmount) FROM Receipt 
                    LEFT JOIN PaymentSubType ON PaymentSubtypeid = ReceiptPaymentSubTypeId 
                    LEFT JOIN PaymentType ON Paymenttypeid = PaymentSubTypePaymentId 
                    WHERE PaymentTypeName = 'Card' AND ReceiptRefPurID = PurId AND ReceiptType = 1), 0) AS CardAmount,
            ISNULL((SELECT SUM(ReceiptAdjustAmount) FROM Receipt 
                    LEFT JOIN PaymentSubType ON PaymentSubtypeid = ReceiptPaymentSubTypeId 
                    LEFT JOIN PaymentType ON Paymenttypeid = PaymentSubTypePaymentId 
                    WHERE (PaymentTypeName = 'Credit Note' OR PaymentTypeName = 'CreditNote') AND ReceiptRefPurID = PurId AND ReceiptType = 1), 0) AS CNoteAmount,
            ISNULL(CompanyBillPrintMessage,'') AS CompanyBillPrintMessage,
            CAST(NULL AS VARBINARY(MAX)) AS UpiId
        FROM Purchase 
        LEFT JOIN PurchaseTrn ON PurId = PurtPurId 
        LEFT JOIN BarcodeDetails ON BarcodeId = PurtBarcodeId 
        LEFT JOIN ProductMaster ON ProductId = PurtProductId 
        LEFT JOIN Colors ON ColorId = PurtColorID 
        LEFT JOIN Brand ON BrandId = ProductBrandId 
        LEFT JOIN Customer ON CustomerId = PurCustomerId 
        LEFT JOIN City cc ON cc.CityId = CustomerCityId 
        LEFT JOIN Salesman ON SalesmanId = CASE WHEN PurtSalesmanID > 0 THEN PurtSalesmanID ELSE PurSalesmanId END
        LEFT JOIN Category ON CategoryId = ProductCtId 
        LEFT JOIN Department ON DeptId = CategoryDeptId 
        LEFT JOIN Hsn ON HsnId = PurtHsnId 
        LEFT JOIN TaxMaster ON TaxId = PurtTaxId 
        LEFT JOIN CompanyProfile ON CompanyId = PurCompanyId 
        LEFT JOIN States csn ON csn.StateId = cc.CityStateId 
        LEFT JOIN City ct ON ct.CityId = CompanyCityNo 
        LEFT JOIN States cs ON cs.StateId = CompanyStateNo 
        LEFT JOIN SizeMaster ON SizeId = ProductSizeId 
        Left join FormType on ScreenNo =PurType 
        WHERE PurId = @PurId";

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.CommandTimeout = 120;
                cmd.Parameters.AddWithValue("@PurId", purId);
                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                {
                    DataTable dt = new DataTable("SalesData");
                    da.Fill(dt);
                    return dt;
                }
            }
        }
    }

    private DataTable GetTaxDataForSubreport(long purId, string connectionString)
    {
        string query = @"
        SELECT
            p.PurId AS SalesId,
            p.PurId AS SalesDocno,
            pt.PurtTaxId AS SalesTaxID,
            ISNULL(pt.PurtTaxRate1, 0) AS SalesTaxRate1,
            ISNULL(pt.PurtTaxRate2, 0) AS SalesTaxRate2,
            ISNULL(SUM(
                (ISNULL(pt.PurtDebitQty, 0) - ISNULL(pt.PurtCreditQty, 0))
                * ISNULL(pt.PurtRate, 0)
                - ISNULL(pt.PurtDiscAmount, 0)
            ), 0) AS TaxableAmount,
            ISNULL(SUM(pt.PurtTaxAmount1), 0) AS TaxAmount1,
            ISNULL(SUM(pt.PurtTaxAmount2), 0) AS TaxAmount2
        FROM Purchase p
        INNER JOIN PurchaseTrn pt ON pt.PurtPurId = p.PurId
        WHERE p.PurId = @PurId
          AND ISNULL(pt.PurtTaxId, 0) > 0
        GROUP BY p.PurId, pt.PurtTaxId, pt.PurtTaxRate1, pt.PurtTaxRate2
        ORDER BY pt.PurtTaxRate1, pt.PurtTaxRate2";

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.CommandTimeout = 120;
                cmd.Parameters.AddWithValue("@PurId", purId);
                using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                {
                    DataTable dt = new DataTable("BillTaxDetailsSubReport");
                    da.Fill(dt);
                    return dt;
                }
            }
        }
    }
        private async Task SavePurchaseViaSP(Purchase header, List<PurchaseTrn> lines)
    {
        var dbContext = (DbContext)_context;
        var connection = dbContext.Database.GetDbConnection();
        bool wasOpen = connection.State == System.Data.ConnectionState.Open;
        if (!wasOpen) await connection.OpenAsync();

        try
        {
            using (var cmd = connection.CreateCommand())
            {
                cmd.CommandText = "InsertPurchase";
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.CommandTimeout = 120; // 2 minutes

                if (dbContext.Database.CurrentTransaction != null)
                {
                    cmd.Transaction = Microsoft.EntityFrameworkCore.Storage.DbContextTransactionExtensions.GetDbTransaction(dbContext.Database.CurrentTransaction);
                }

                // Add header parameters
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurCompanyId", (object)header.PurCompanyId));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurCompanyCount", (object)header.PurCompanyCount));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurType", (object)header.PurType));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurLocation", header.PurLocation.HasValue ? (object)header.PurLocation.Value : DBNull.Value));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurDocNo", (object)header.PurDocno));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurDocDate", header.PurDocDate.HasValue ? (object)header.PurDocDate.Value : DBNull.Value));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurCustomerId", header.PurCustomerId.HasValue ? (object)header.PurCustomerId.Value : DBNull.Value));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurSupplierId", (object)(header.PurSupplierId ?? 0)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurGrossAmount", (object)(header.PurGrossAmount ?? 0m)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurDiscountPercent", (object)(header.PurDiscountPercent ?? 0m)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurDiscountAmount", (object)(header.PurDiscountAmount ?? 0m)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurIgstAmount", (object)(header.PurIgstAmount ?? 0m)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurCgstAmount", (object)(header.PurCgstAmount ?? 0m)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurSgstAmount", (object)(header.PurSgstAmount ?? 0m)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurUgstAmount", (object)(header.PurUgstAmount ?? 0m)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurGstType", (object)(header.PurGstType ?? 0)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurTcsAmount", (object)(header.PurTcsAmount ?? 0m)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurRecordCreated", (object)(header.PurRecordCreated ?? DateTime.UtcNow)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurRecordModified", (object)(header.PurRecordModified ?? DateTime.UtcNow)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurUserNewId", (object)(header.PurUserNewId ?? 0)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurLastModified", (object)(header.PurLastModified ?? 0)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurTimeStamp", (object)0L)); 
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurMaxPkno", header.PurMaxPkno.HasValue ? (object)header.PurMaxPkno.Value : DBNull.Value));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurTotalQty", (object)(header.PurTotalQty ?? 0m)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurBillNo", (object)(header.PurBillNo ?? string.Empty)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurBillDate", header.PurBillDate.HasValue ? (object)header.PurBillDate.Value : DBNull.Value));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurChallanNo", (object)(header.PurChallanNo ?? string.Empty)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurChallanDate", header.PurChallanDate.HasValue ? (object)header.PurChallanDate.Value : DBNull.Value));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurId", (object)header.PurId));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurNetAmount", (object)(header.PurNetAmount ?? 0m)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurSalesmanId", (object)(header.PurSalesmanId ?? 0)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurRoundOff", (object)(header.PurRoundoff ?? 0m)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurCreditBill", (object)(header.PurCreditBill ?? false)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurExclusiveBill", (object)(header.PurExclusiveBill ?? false)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurOpeningStock", (object)(header.PurOpeningStock ?? false)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurEntryType", (object)(header.PurEntryType ?? 0)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurComments", (object)(header.PurComments ?? string.Empty)));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurVerify", (object)(header.PurVerify ?? false)));
                
                // SP Defaults
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurBrandId", (object)0L));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurCourierRequired", (object)false));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurCourierNo", (object)string.Empty));
                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@PurCourierDelivered", (object)false));

                // Create PurchaseDetailsType DataTable
                var dtDetails = new System.Data.DataTable();
                dtDetails.Columns.Add("PurtId", typeof(long));
                dtDetails.Columns.Add("Purtsdocno", typeof(long));
                dtDetails.Columns.Add("PurtOrderBy", typeof(long));
                dtDetails.Columns.Add("PurtSize", typeof(string));
                dtDetails.Columns.Add("PurtDebitQty", typeof(decimal));
                dtDetails.Columns.Add("PurtCreditQty", typeof(decimal));
                dtDetails.Columns.Add("PurtBarcodeId", typeof(long));
                dtDetails.Columns.Add("PurtProductId", typeof(long));
                dtDetails.Columns.Add("PurtColorID", typeof(long));
                dtDetails.Columns.Add("PurtRecordCreated", typeof(DateTime));
                dtDetails.Columns.Add("PurtRecordModified", typeof(DateTime));
                dtDetails.Columns.Add("PurtPurchaseRate", typeof(decimal));
                dtDetails.Columns.Add("PurtSelPrice", typeof(decimal));
                dtDetails.Columns.Add("PurtMrp", typeof(decimal));
                dtDetails.Columns.Add("PurtMaxPkno", typeof(long));
                dtDetails.Columns.Add("PurtLocation", typeof(long));
                dtDetails.Columns.Add("PurtHsnId", typeof(long));
                dtDetails.Columns.Add("PurtTaxId", typeof(long));
                dtDetails.Columns.Add("PurtTaxRate1", typeof(decimal));
                dtDetails.Columns.Add("PurtTaxRate2", typeof(decimal));
                dtDetails.Columns.Add("PurtDiscountPercent", typeof(decimal));
                dtDetails.Columns.Add("PurtDiscAmount", typeof(decimal));
                dtDetails.Columns.Add("PurtSizeId", typeof(long));
                dtDetails.Columns.Add("PurtDebitAmount", typeof(decimal));
                dtDetails.Columns.Add("PurtCreditAmount", typeof(decimal));
                dtDetails.Columns.Add("PurtCostRate", typeof(decimal));
                dtDetails.Columns.Add("PurtPerQty", typeof(decimal));
                dtDetails.Columns.Add("PurtPerDiscount", typeof(decimal));
                dtDetails.Columns.Add("PurtTaxAmount1", typeof(decimal));
                dtDetails.Columns.Add("PurtTaxAmount2", typeof(decimal));
                dtDetails.Columns.Add("PurtParentId", typeof(long));
                dtDetails.Columns.Add("PurtParentDocno", typeof(long));
                dtDetails.Columns.Add("PurtRate", typeof(decimal));
                dtDetails.Columns.Add("PurtOrdtId", typeof(long));
                dtDetails.Columns.Add("PurtRackNo", typeof(long));
                dtDetails.Columns.Add("PurtDetailSDocno", typeof(int));
                dtDetails.Columns.Add("PurtMiddleRate", typeof(decimal));
                dtDetails.Columns.Add("PurtMiddleMrp", typeof(decimal));
                dtDetails.Columns.Add("PurtMiddleSelPrice", typeof(decimal));
                dtDetails.Columns.Add("PurtSizeFrom", typeof(string));
                dtDetails.Columns.Add("PurtSizeTo", typeof(string));
                dtDetails.Columns.Add("PurtSizeMiddle", typeof(string));
                dtDetails.Columns.Add("PurtSelPriceDiscPercent", typeof(decimal));
                dtDetails.Columns.Add("PurtRateDiff", typeof(decimal));
                dtDetails.Columns.Add("PurtMrpDiff", typeof(decimal));
                dtDetails.Columns.Add("PurtMarkDown", typeof(bool));
                dtDetails.Columns.Add("PurtMarkDownPercent", typeof(decimal));
                dtDetails.Columns.Add("PurtAlteration", typeof(bool));
                dtDetails.Columns.Add("PurtSubSizeId", typeof(long));
                dtDetails.Columns.Add("PurtDeliveryDate", typeof(DateTime));
                dtDetails.Columns.Add("PurtSalesmanId", typeof(long));
                dtDetails.Columns.Add("PurtRemarks", typeof(string));
                dtDetails.Columns.Add("PurtSourcecode", typeof(string));
                dtDetails.Columns.Add("PurtSalesmanPoints", typeof(decimal));
                dtDetails.Columns.Add("PurtTotalSalesmanpoint", typeof(decimal));

                foreach (var line in lines)
                {
                    dtDetails.Rows.Add(
                        line.PurtId,
                        line.Purtsdocno,
                        line.PurtOrderBy,
                        line.PurtSize ?? (object)DBNull.Value,
                        line.PurtDebitQty ?? 0m,
                        line.PurtCreditQty ?? 0m,
                        line.PurtBarcodeId ?? (object)DBNull.Value,
                        line.PurtProductId ?? (object)DBNull.Value,
                        line.PurtColorId ?? (object)DBNull.Value,
                        line.PurtRecordCreated ?? DateTime.UtcNow,
                        line.PurtRecordModified ?? DateTime.UtcNow,
                        line.PurtPurchaseRate ?? 0m,
                        line.PurtSelPrice ?? 0m,
                        line.PurtMrp ?? 0m,
                        line.PurtMaxPkno ?? 0L,
                        line.PurtLocation ?? (object)DBNull.Value,
                        line.PurtHsnId ?? (object)DBNull.Value,
                        line.PurtTaxId ?? (object)DBNull.Value,
                        line.PurtTaxRate1 ?? 0m,
                        line.PurtTaxRate2 ?? 0m,
                        line.PurtDiscountPercent ?? 0m,
                        line.PurtDiscAmount ?? 0m,
                        line.PurtSizeId ?? 0L,
                        line.PurtDebitAmount ?? 0m,
                        line.PurtCreditAmount ?? 0m,
                        line.PurtCostRate ?? 0m,
                        line.PurtPerQty ?? 0m,
                        line.PurtPerDiscount ?? 0m,
                        line.PurtTaxAmount1 ?? 0m,
                        line.PurtTaxAmount2 ?? 0m,
                        line.PurtParentId ?? 0L,
                        line.PurtParentDocno ?? 0L,
                        line.PurtRate ?? 0m,
                        line.PurtOrdtId ?? 0L,
                        line.PurtRackNo ?? 0L,
                        0, // PurtDetailSDocno default
                        line.PurtMiddleRate ?? 0m,
                        line.PurtMiddleMrp ?? 0m,
                        line.PurtMiddleSelPrice ?? 0m,
                        line.PurtSizeFrom ?? string.Empty,
                        line.PurtSizeTo ?? string.Empty,
                        line.PurtSizeMiddle ?? string.Empty,
                        line.PurtSelPriceDiscPercent ?? 0m,
                        line.PurtRateDiff ?? 0m,
                        line.PurtMrpDiff ?? 0m,
                        line.PurtMarkDown ?? false,
                        line.PurtMarkDownPercent ?? 0m,
                        line.PurtAlteration ?? false,
                        line.PurtSubSizeId ?? 0L,
                        line.PurtDeliveryDate ?? (object)DBNull.Value,
                        line.PurtSalesmanId ?? 0L,
                        line.PurtRemarks ?? (object)DBNull.Value,
                        line.PurtSourcecode ?? (object)DBNull.Value,
                        line.PurtSalesmanPoints ?? 0m,
                        line.PurtTotalSalesmanpoint ?? 0m
                    );
                }

                var pDetails = new Microsoft.Data.SqlClient.SqlParameter("@PurchaseDetails", dtDetails)
                {
                    SqlDbType = System.Data.SqlDbType.Structured,
                    TypeName = "PurchaseDetailsType"
                };
                cmd.Parameters.Add(pDetails);

                // Create PurchaseChargeType DataTable (empty)
                var dtCharges = new System.Data.DataTable();
                dtCharges.Columns.Add("PurcId", typeof(long));
                dtCharges.Columns.Add("PurcChargeId", typeof(long));
                dtCharges.Columns.Add("PurcChargeRate", typeof(decimal));
                dtCharges.Columns.Add("PurcAmount", typeof(decimal));
                dtCharges.Columns.Add("PurcTaxId", typeof(long));
                dtCharges.Columns.Add("PurcTaxRate1", typeof(decimal));
                dtCharges.Columns.Add("PurcTaxAmount1", typeof(decimal));
                dtCharges.Columns.Add("PurcTaxRate2", typeof(decimal));
                dtCharges.Columns.Add("PurcTaxAmount2", typeof(decimal));
                dtCharges.Columns.Add("PurcRecordCreated", typeof(DateTime));
                dtCharges.Columns.Add("PurcRecordModified", typeof(DateTime));
                dtCharges.Columns.Add("PurcMaxPkno", typeof(long));
                dtCharges.Columns.Add("PurcLocation", typeof(long));
                dtCharges.Columns.Add("PurcHsnId", typeof(long));
                dtCharges.Columns.Add("PurcReverseTaxAmount1", typeof(decimal));
                dtCharges.Columns.Add("PurcReverseTaxAmount2", typeof(decimal));

                var pCharges = new Microsoft.Data.SqlClient.SqlParameter("@PurchaseCharges", dtCharges)
                {
                    SqlDbType = System.Data.SqlDbType.Structured,
                    TypeName = "PurchaseChargeType"
                };
                cmd.Parameters.Add(pCharges);

                cmd.Parameters.Add(new Microsoft.Data.SqlClient.SqlParameter("@OriginalTimeStampBigint", DBNull.Value));

                var outNewTimestamp = new Microsoft.Data.SqlClient.SqlParameter("@NewTimeStampBigint", System.Data.SqlDbType.BigInt)
                {
                    Direction = System.Data.ParameterDirection.InputOutput,
                    Value = 0L
                };
                cmd.Parameters.Add(outNewTimestamp);

                await cmd.ExecuteNonQueryAsync();
            }
        }
        finally
        {
            if (!wasOpen && connection.State == System.Data.ConnectionState.Open)
            {
                connection.Close();
            }
        }
    }
}