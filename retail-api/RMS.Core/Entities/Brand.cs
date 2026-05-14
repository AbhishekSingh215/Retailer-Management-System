using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Brand
{
    public long BrandId { get; set; }

    public string BrandName { get; set; } = null!;

    public DateTime BrandRecordCreated { get; set; }

    public DateTime BrandRecordModified { get; set; }

    public long BrandUserId { get; set; }

    public long? BrandLastModified { get; set; }

    public byte[] BrandTimestamp { get; set; } = null!;

    public long? BrandLocation { get; set; }

    public long? BrandMaxPkno { get; set; }
}
