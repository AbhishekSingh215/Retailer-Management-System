using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class OrderTable
{
    public long OrdId { get; set; }

    public long? OrdCompanyId { get; set; }

    public long? OrdCompanyCount { get; set; }

    public long? OrdType { get; set; }

    public long? OrdLocation { get; set; }

    public long? OrdDocno { get; set; }

    public DateTime? OrdDocDate { get; set; }

    public long? OrdCustomerId { get; set; }

    public decimal? OrdGrossAmount { get; set; }

    public decimal? OrdDiscountPercent { get; set; }

    public decimal? OrdDiscountAmount { get; set; }

    public decimal? OrdIgstAmount { get; set; }

    public decimal? OrdCgstAmount { get; set; }

    public decimal? OrdSgstAmount { get; set; }

    public decimal? OrdUgstAmount { get; set; }

    public long? OrdGstType { get; set; }

    public decimal? OrdTcsAmount { get; set; }

    public DateTime? OrdRecordCreated { get; set; }

    public DateTime? OrdRecordModified { get; set; }

    public long? OrdUserNewId { get; set; }

    public long? OrdLastModified { get; set; }

    public byte[]? OrdTimeStamp { get; set; }

    public long? OrdMaxPkno { get; set; }

    public decimal? OrdTotalQty { get; set; }

    public string? OrdBillNo { get; set; }

    public DateTime? OrdBillDate { get; set; }

    public string? OrdChallanNo { get; set; }

    public DateTime? OrdChallanDate { get; set; }

    public decimal? OrdNetAmount { get; set; }
}
