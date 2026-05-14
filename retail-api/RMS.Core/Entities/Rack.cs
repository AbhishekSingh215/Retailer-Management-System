using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Rack
{
    public long RackId { get; set; }

    public long RackGodownId { get; set; }

    public string RackCode { get; set; } = null!;

    public string RackDesc { get; set; } = null!;

    public DateTime RackRecordCreated { get; set; }

    public DateTime RackRecordModified { get; set; }

    public long RackUserId { get; set; }

    public long? RackLastModified { get; set; }

    public byte[] RackTimestamp { get; set; } = null!;

    public long? RackLocation { get; set; }

    public long? RackMaxPkno { get; set; }
}
