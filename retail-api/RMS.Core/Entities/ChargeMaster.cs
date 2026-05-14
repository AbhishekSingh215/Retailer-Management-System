using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class ChargeMaster
{
    public long ChargeId { get; set; }

    public string? ChargeDesc { get; set; }

    public decimal? ChargeRate { get; set; }

    public bool? ChargeDeactive { get; set; }

    public long? Chargelocation { get; set; }

    public long? ChargeMaxPkno { get; set; }

    public DateTime? ChargeRecordCreated { get; set; }

    public DateTime? ChargeRecordModified { get; set; }

    public long? ChargeUserId { get; set; }

    public long? ChargeLastModified { get; set; }

    public byte[]? ChargeTimestamp { get; set; }

    public bool? ChargeIsDefault { get; set; }
}
