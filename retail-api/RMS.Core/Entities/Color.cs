using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Color
{
    public long ColorId { get; set; }

    public string ColorName { get; set; } = null!;

    public DateTime ColorRecordCreated { get; set; }

    public DateTime ColorRecordModified { get; set; }

    public long ColorUserId { get; set; }

    public long? ColorLastModified { get; set; }

    public byte[] ColorTimestamp { get; set; } = null!;

    public string? ColorCode { get; set; }

    public long? ColorLocation { get; set; }

    public long? ColorMaxPkno { get; set; }

    public bool? ColorIsDefault { get; set; }
}
