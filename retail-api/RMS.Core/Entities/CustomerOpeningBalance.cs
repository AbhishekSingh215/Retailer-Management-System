using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class CustomerOpeningBalance
{
    public long CobId { get; set; }

    public long CobCustomerId { get; set; }

    public string? CobBillNo { get; set; }

    public DateTime? CobBillDate { get; set; }

    public decimal CobAmount { get; set; }

    public string? CobRemarks { get; set; }

    public bool CobIsSummary { get; set; }

    public long? CobCompanyId { get; set; }

    public long? CobCompanyCount { get; set; }

    public long? CobLocation { get; set; }

    public DateTime? CobRecordCreated { get; set; }

    public DateTime? CobRecordModified { get; set; }

    public long? CobUserId { get; set; }
}
