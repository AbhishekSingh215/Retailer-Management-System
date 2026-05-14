using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Zone
{
    public long ZoneId { get; set; }

    public string ZoneName { get; set; } = null!;

    public DateTime ZoneRecordCreated { get; set; }

    public DateTime ZoneRecordModified { get; set; }

    public long ZoneUserId { get; set; }

    public long? ZoneLastModified { get; set; }

    public byte[] ZoneTimestamp { get; set; } = null!;

    public long? ZoneLocation { get; set; }

    public long? ZoneMaxPkno { get; set; }
}
