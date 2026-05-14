using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class SizeMaster
{
    public long SizeId { get; set; }

    public string SizeCode { get; set; } = null!;

    public string SizeDescription { get; set; } = null!;

    public DateTime SizeRecordCreated { get; set; }

    public DateTime SizeRecordModified { get; set; }

    public long SizeUserId { get; set; }

    public long? SizeLastModified { get; set; }

    public byte[] SizeTimestamp { get; set; } = null!;

    public long? SizeLocation { get; set; }

    public long? SizeMaxPkno { get; set; }

    public bool? SizeDeactive { get; set; }
}
