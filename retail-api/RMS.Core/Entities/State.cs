using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class State
{
    public long StateId { get; set; }

    public string StateName { get; set; } = null!;

    public long StateCountryId { get; set; }

    public DateTime StateRecordCreated { get; set; }

    public DateTime StateRecordModified { get; set; }

    public long StateUserId { get; set; }

    public long? StateLastModified { get; set; }

    public byte[] StateTimestamp { get; set; } = null!;

    public long? StateLocation { get; set; }

    public long? StateMaxPkno { get; set; }

    public string? StateGstCode { get; set; }

    public bool? StateUt { get; set; }
}
