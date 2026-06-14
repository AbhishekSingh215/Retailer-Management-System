using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Purchase
{
    public long PurId { get; set; }

    public long? PurCompanyId { get; set; }

    public long? PurCompanyCount { get; set; }

    public long? PurType { get; set; }

    public long? PurLocation { get; set; }

    public long? PurDocno { get; set; }

    public DateTime? PurDocDate { get; set; }

    public long? PurSupplierId { get; set; }

    public decimal? PurGrossAmount { get; set; }

    public decimal? PurDiscountPercent { get; set; }

    public decimal? PurDiscountAmount { get; set; }

    public decimal? PurIgstAmount { get; set; }

    public decimal? PurCgstAmount { get; set; }

    public decimal? PurSgstAmount { get; set; }

    public decimal? PurUgstAmount { get; set; }

    public long? PurGstType { get; set; }

    public decimal? PurTcsAmount { get; set; }

    public DateTime? PurRecordCreated { get; set; }

    public DateTime? PurRecordModified { get; set; }

    public long? PurUserNewId { get; set; }

    public long? PurLastModified { get; set; }

    public byte[]? PurTimeStamp { get; set; }

    public long? PurMaxPkno { get; set; }

    public decimal? PurTotalQty { get; set; }

    public string? PurBillNo { get; set; }

    public DateTime? PurBillDate { get; set; }

    public string? PurChallanNo { get; set; }

    public DateTime? PurChallanDate { get; set; }

    public decimal? PurNetAmount { get; set; }

    public long? PurCustomerId { get; set; }

    public long? PurSalesmanId { get; set; }

    public decimal? PurRoundoff { get; set; }

    public bool? PurCreditBill { get; set; }

    public decimal? PurCashAmount { get; set; }

    public decimal? PurCardAmount { get; set; }

    public decimal? PurUpiAmount { get; set; }

    public decimal? PurCreditNoteAmount { get; set; }

    public decimal? PurAdvanceAmount { get; set; }

    public decimal? PurReceiptAmount { get; set; }

    public bool? PurOpeningStock { get; set; }

    public int? PurEntryType { get; set; }

    public string? PurComments { get; set; }

    public bool IsDeleted { get; set; }

    public bool? PurVerify { get; set; }

    public bool? PurExclusiveBill { get; set; }

    public bool? PurIsSynced { get; set; }

    public bool? PurStockAudit { get; set; }

    public string? PurStatus { get; set; }
}
