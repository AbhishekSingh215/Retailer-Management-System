using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Unit
{
    public long UnitId { get; set; }

    public string UnitCode { get; set; } = null!;

    public string UnitName { get; set; } = null!;

    public string UnitDescGst { get; set; } = null!;

    public DateTime UnitRecordCreated { get; set; }

    public DateTime UnitRecordModified { get; set; }

    public long UnitUserId { get; set; }

    public long? UnitLastModified { get; set; }

    public byte[] UnitTimestamp { get; set; } = null!;

    public long? UnitLocation { get; set; }

    public long? UnitMaxPkno { get; set; }
}
