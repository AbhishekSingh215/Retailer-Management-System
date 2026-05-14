using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Supplier
{
    public long SupplierId { get; set; }

    public string SupplierName { get; set; } = null!;

    public string? SupplierNickName { get; set; }

    public string? SupplierAddress1 { get; set; }

    public string? SupplierAddress2 { get; set; }

    public string? SupplierAddress3 { get; set; }

    public string? SupplierEmailId { get; set; }

    public string? SupplierMobileNo { get; set; }

    public string? SupplierMobileNo2 { get; set; }

    public string? SupplierGstNo { get; set; }

    public string? SupplierPanNo { get; set; }

    public long? SupplierCityId { get; set; }

    public long? SupplierAreaId { get; set; }

    public string? SupplierRemarks { get; set; }

    public long? SupplierLocation { get; set; }

    public long? SupplierMaxPkno { get; set; }

    public DateTime? SupplierRecordCreated { get; set; }

    public DateTime? SupplierRecordModified { get; set; }

    public long? SupplierUserId { get; set; }

    public long? SupplierLastModified { get; set; }

    public byte[] SupplierTimeStamp { get; set; } = null!;

    public bool? SupplierDeActive { get; set; }

    public int? SupplierGstType { get; set; }

    public decimal? SupplierPincode { get; set; }

    public decimal? SupplierDiscountPercent { get; set; }

    public int? SupplierCreditDays { get; set; }

    public string? SupplierCode { get; set; }
}
