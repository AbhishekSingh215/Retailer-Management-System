using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class SupplierOpeningBalance
{
    public long Sobid { get; set; }

    public long CompanyId { get; set; }

    public long? CompanyCount { get; set; }

    public long SupplierId { get; set; }

    public DateTime OpeningDate { get; set; }

    public decimal BillAmount { get; set; }

    public decimal Amount { get; set; }

    public string? SupplierBillNo { get; set; }

    public DateTime? SupplierBillDate { get; set; }

    public string? SupplierDocNo { get; set; }

    public DateTime? SupplierDocDate { get; set; }

    public bool IsCredit { get; set; }

    public string? ReferenceNo { get; set; }

    public string? Remarks { get; set; }

    public bool IsAdjusted { get; set; }

    public decimal AdjustedAmount { get; set; }

    public long? CreatedBy { get; set; }

    public DateTime CreatedOn { get; set; }

    public long? ModifiedBy { get; set; }

    public DateTime? ModifiedOn { get; set; }

    public bool Verified { get; set; }

    public long? LinkedPurchaseId { get; set; }

    public bool IsDeleted { get; set; }

    public byte OpeningType { get; set; }
}
