using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class PurchaseTrn
{
    public long PurtId { get; set; }

    public long? PurtPurId { get; set; }

    public long? Purtsdocno { get; set; }

    public long? PurtOrderBy { get; set; }

    public string? PurtSize { get; set; }

    public decimal? PurtDebitQty { get; set; }

    public decimal? PurtCreditQty { get; set; }

    public long? PurtBarcodeId { get; set; }

    public long? PurtProductId { get; set; }

    public long? PurtColorId { get; set; }

    public DateTime? PurtRecordCreated { get; set; }

    public DateTime? PurtRecordModified { get; set; }

    public decimal? PurtPurchaseRate { get; set; }

    public decimal? PurtSelPrice { get; set; }

    public decimal? PurtMrp { get; set; }

    public long? PurtMaxPkno { get; set; }

    public long? PurtLocation { get; set; }

    public long? PurtHsnId { get; set; }

    public long? PurtTaxId { get; set; }

    public decimal? PurtTaxRate1 { get; set; }

    public decimal? PurtTaxRate2 { get; set; }

    public decimal? PurtDiscountPercent { get; set; }

    public decimal? PurtDiscAmount { get; set; }

    public long? PurtSizeId { get; set; }

    public decimal? PurtCostRate { get; set; }

    public decimal? PurtPerQty { get; set; }

    public decimal? PurtDebitAmount { get; set; }

    public decimal? PurtCreditAmount { get; set; }

    public decimal? PurtPerDiscount { get; set; }

    public decimal? PurtTaxAmount1 { get; set; }

    public decimal? PurtTaxAmount2 { get; set; }

    public long? PurtParentId { get; set; }

    public long? PurtParentDocno { get; set; }

    public decimal? PurtRate { get; set; }

    public decimal? PurtReverseTaxAmount1 { get; set; }

    public decimal? PurtReverseTaxAmount2 { get; set; }

    public long? PurtSalesmanId { get; set; }

    public decimal? PurtCommissionRate { get; set; }

    public long? PurtRackNo { get; set; }

    public long? PurtOrdtId { get; set; }

    public int? PurtDetailSdocno { get; set; }

    public decimal? PurtMiddleRate { get; set; }

    public decimal? PurtMiddleMrp { get; set; }

    public decimal? PurtMiddleSelPrice { get; set; }

    public string? PurtSizeFrom { get; set; }

    public string? PurtSizeTo { get; set; }

    public string? PurtSizeMiddle { get; set; }

    public decimal? PurtSelPriceDiscPercent { get; set; }

    public decimal? PurtRateDiff { get; set; }

    public decimal? PurtMrpDiff { get; set; }

    public bool? PurtMarkDown { get; set; }

    public decimal? PurtMarkDownPercent { get; set; }

    public bool? PurtAlteration { get; set; }

    public long? PurtSubSizeId { get; set; }

    public DateTime? PurtDeliveryDate { get; set; }

    public long? PurtJobberId { get; set; }

    public bool? PurtReceived { get; set; }

    public bool? PurtWhatsappSent { get; set; }

    public string? PurtAlterationImage { get; set; }

    public DateTime? PurtDeliveredDate { get; set; }

    public DateTime? PurtReceivedDate { get; set; }

    public bool? PurtDelivered { get; set; }

    public bool? PurtWhatsappSentonReceived { get; set; }

    public string? PurtRemarks { get; set; }

    public string? PurtSourcecode { get; set; }

    public decimal? PurtSalesmanPoints { get; set; }

    public decimal? PurtTotalSalesmanpoint { get; set; }

    public decimal? PurtPackQty { get; set; }
}
