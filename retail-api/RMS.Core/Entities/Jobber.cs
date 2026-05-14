using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Jobber
{
    public long? JobberId { get; set; }

    public string JobberName { get; set; } = null!;

    public string? JobberNickName { get; set; }

    public string? JobberAddress1 { get; set; }

    public string? JobberAddress2 { get; set; }

    public string? JobberAddress3 { get; set; }

    public string? JobberEmailId { get; set; }

    public string? JobberMobileNo { get; set; }

    public string? JobberMobileNo2 { get; set; }

    public string? JobberGstNo { get; set; }

    public string? JobberPanNo { get; set; }

    public long? JobberCityId { get; set; }

    public long? JobberAreaId { get; set; }

    public string? JobberRemarks { get; set; }

    public long? JobberLocation { get; set; }

    public long? JobberMaxPkno { get; set; }

    public DateTime? JobberRecordCreated { get; set; }

    public DateTime? JobberRecordModified { get; set; }

    public long? JobberUserId { get; set; }

    public long? JobberLastModified { get; set; }

    public byte[] JobberTimeStamp { get; set; } = null!;

    public bool? JobberDeActive { get; set; }

    public int? JobberGstType { get; set; }

    public decimal? JobberPincode { get; set; }

    public decimal? JobberDiscountPercent { get; set; }

    public int? JobberCreditDays { get; set; }

    public string? JobberCode { get; set; }
}
