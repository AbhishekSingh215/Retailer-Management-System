using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Salesman
{
    public long SalesmanId { get; set; }

    public string SalesmanName { get; set; } = null!;

    public string? SalesmanNickName { get; set; }

    public string? SalesmanAddress1 { get; set; }

    public string? SalesmanAddress2 { get; set; }

    public string? SalesmanAddress3 { get; set; }

    public string? SalesmanEmailId { get; set; }

    public string? SalesmanMobileNo { get; set; }

    public string? SalesmanMobileNo2 { get; set; }

    public string? SalesmanPanNo { get; set; }

    public DateTime? SalesmanBirthDate { get; set; }

    public DateTime? SalesmanDoj { get; set; }

    public long? SalesmanCityId { get; set; }

    public long? SalesmanAreaId { get; set; }

    public decimal? SalesmanCommission { get; set; }

    public string? SalesmanRemarks { get; set; }

    public long? SalesmanLocation { get; set; }

    public long? SalesmanMaxPkno { get; set; }

    public DateTime? SalesmanRecordCreated { get; set; }

    public DateTime? SalesmanRecordModified { get; set; }

    public long? SalesmanUserId { get; set; }

    public long? SalesmanLastModified { get; set; }

    public byte[] SalesmanTimeStamp { get; set; } = null!;

    public bool? SalesmanDeActive { get; set; }

    public string? SalesmanCode { get; set; }
}
