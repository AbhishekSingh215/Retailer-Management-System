using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Godown
{
    public long GodownId { get; set; }

    public string GodownCode { get; set; } = null!;

    public string GodownDesc { get; set; } = null!;

    public DateTime GodownRecordCreated { get; set; }

    public DateTime GodownRecordModified { get; set; }

    public long GodownUserId { get; set; }

    public long? GodownLastModified { get; set; }

    public byte[] GodownTimestamp { get; set; } = null!;

    public long? GodownLocation { get; set; }

    public long? GodownMaxPkno { get; set; }
}
