using System;
using System.Collections.Generic;

namespace RMS.Application.DTOs;

public class SalesInvoiceDto
{
    public long PurId { get; set; }
    public long CompanyId { get; set; }
    public long CompanyCount { get; set; }
    public long DocNo { get; set; }
    public string DocDate { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string MobileNumber { get; set; } = string.Empty;
    public decimal GrossAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal NetAmount { get; set; }
    public decimal TotalQty { get; set; }
    public long? PurSalesmanId { get; set; }
    public string SalesmanName { get; set; } = string.Empty;
    public string Status { get; set; } = "EDIT";
    public bool? PurExclusiveBill { get; set; }
    public List<SalesLineItemDto> Items { get; set; } = new List<SalesLineItemDto>();
}

public class SalesLineItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Barcode { get; set; } = string.Empty;
    public string SourceCode { get; set; } = string.Empty;
    public string ProductCode { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string Size { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Hsn { get; set; } = string.Empty;
    public string TaxDesc { get; set; } = string.Empty;
    public decimal TaxAmt { get; set; }
    public long? TaxId { get; set; }
    public decimal? TaxRate { get; set; }
    public decimal Mrp { get; set; }
    public decimal SelPrice { get; set; }
    public decimal Discount { get; set; }
    public decimal Qty { get; set; }
    public decimal Amount { get; set; }
    public bool IsIndividual { get; set; }
    public bool IsNoStockChecking { get; set; }
    public decimal AvailableStock { get; set; }
}
