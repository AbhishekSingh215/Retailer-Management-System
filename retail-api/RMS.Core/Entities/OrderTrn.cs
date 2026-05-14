using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class OrderTrn
{
    public long OrdtId { get; set; }

    public long? OrdtOrdId { get; set; }

    public long? Ordtsdocno { get; set; }

    public long? OrderBy { get; set; }

    public string? OrdtSize { get; set; }

    public decimal? OrdtDebitQty { get; set; }

    public decimal? OrdtCreditQty { get; set; }

    public long? OrdtBarcodeId { get; set; }

    public long? OrdtProductId { get; set; }

    public long? OrdtColorId { get; set; }

    public DateTime? OrdtRecordCreated { get; set; }

    public DateTime? OrdtRecordModified { get; set; }

    public decimal? OrdtPurchaseRate { get; set; }

    public decimal? OrdtSelPrice { get; set; }

    public decimal? OrdtMrp { get; set; }

    public long? OrdtMaxPkno { get; set; }

    public long? OrdtLocation { get; set; }

    public long? OrdtHsnId { get; set; }

    public long? OrdtTaxId { get; set; }

    public decimal? OrdtTaxRate1 { get; set; }

    public decimal? OrdtTaxRate2 { get; set; }

    public decimal? OrdtDiscountPercent { get; set; }

    public decimal? OrdtDiscAmount { get; set; }

    public long? OrdtSizeId { get; set; }

    public decimal? OrdtDebitAmount { get; set; }

    public decimal? OrdtCreditAmount { get; set; }

    public decimal? OrdtPerDiscount { get; set; }

    public decimal? OrdtTaxAmount1 { get; set; }

    public decimal? OrdtTaxAmount2 { get; set; }

    public long? OrdtParentId { get; set; }

    public long? OrdtParentDocno { get; set; }

    public decimal? OrdtRate { get; set; }
}
