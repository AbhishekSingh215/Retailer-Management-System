using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Customer
{
    public long CustomerId { get; set; }

    public string CustomerName { get; set; } = null!;

    public string? CustomerNickName { get; set; }

    public string? CustomerAddress1 { get; set; }

    public string? CustomerAddress2 { get; set; }

    public string? CustomerAddress3 { get; set; }

    public string? CustomerEmailId { get; set; }

    public string? CustomerMobileNo { get; set; }

    public string? CustomerMobileNo2 { get; set; }

    public string? CustomerGstNo { get; set; }

    public string? CustomerPanNo { get; set; }

    public DateTime? CustomerBirthDate { get; set; }

    public DateTime? CustomerAnnDate { get; set; }

    public long? CustomerCityId { get; set; }

    public long? CustomerAreaId { get; set; }

    public string? CustomerRemarks { get; set; }

    public long? CustomerLocation { get; set; }

    public long? CustomerMaxPkno { get; set; }

    public DateTime? CustomerRecordCreated { get; set; }

    public DateTime? CustomerRecordModified { get; set; }

    public long? CustomerUserId { get; set; }

    public long? CustomerLastModified { get; set; }

    public byte[] CustomerTimeStamp { get; set; } = null!;

    public bool? CustomerDeActive { get; set; }

    public int? CustomerGstType { get; set; }

    public decimal? CustomerPincode { get; set; }

    public long? CustomerCgId { get; set; }

    public long? CustomerReligionId { get; set; }

    public string? CustomerCode { get; set; }

    public int? CustomerGender { get; set; }

    public bool CustomerIsLedger { get; set; }
}
