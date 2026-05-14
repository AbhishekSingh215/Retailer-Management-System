using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Religion
{
    public long ReligionId { get; set; }

    public string ReligionName { get; set; } = null!;

    public DateTime ReligionRecordCreated { get; set; }

    public DateTime ReligionRecordModified { get; set; }

    public long ReligionUserId { get; set; }

    public long? ReligionLastModified { get; set; }

    public byte[] ReligionTimestamp { get; set; } = null!;

    public long? ReligionLocation { get; set; }

    public long? ReligionMaxPkno { get; set; }
}
