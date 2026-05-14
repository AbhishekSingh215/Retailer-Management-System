using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class SizeDetail
{
    public long SzdId { get; set; }

    public long SzdSizeId { get; set; }

    public string? SzdSize { get; set; }

    public string? SzdAddtionalDetail { get; set; }

    public long? SzdOrderBy { get; set; }

    public DateTime? SzdRecordCreated { get; set; }

    public DateTime? SzdRecordModified { get; set; }

    public long? SzdUserId { get; set; }

    public long? SzdLastModified { get; set; }

    public long? SzdLocation { get; set; }

    public long? SzdMaxPkno { get; set; }

    public bool? SzdDeactive { get; set; }
}
