using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class SubSizeMaster
{
    public long SubSizeId { get; set; }

    public string SubSizeName { get; set; } = null!;

    public DateTime SubSizeRecordCreated { get; set; }

    public DateTime SubSizeRecordModified { get; set; }

    public long SubSizeUserId { get; set; }

    public long? SubSizeLastModified { get; set; }

    public byte[] SubSizeTimestamp { get; set; } = null!;

    public string? SubSizeCode { get; set; }

    public long? SubSizeLocation { get; set; }

    public long? SubSizeMaxPkno { get; set; }

    public bool? SubSizeIsDefault { get; set; }
}
