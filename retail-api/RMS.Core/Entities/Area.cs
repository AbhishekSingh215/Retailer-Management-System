using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Area
{
    public long AreaId { get; set; }

    public string AreaName { get; set; } = null!;

    public DateTime AreaRecordCreated { get; set; }

    public DateTime AreaRecordModified { get; set; }

    public long AreaUserId { get; set; }

    public long? AreaLastModified { get; set; }

    public byte[] AreaTimestamp { get; set; } = null!;

    public long? AreaLocation { get; set; }

    public long? AreaMaxPkno { get; set; }

    public long? AreaZoneId { get; set; }
}
