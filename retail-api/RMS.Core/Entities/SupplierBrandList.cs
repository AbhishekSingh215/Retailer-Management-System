using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class SupplierBrandList
{
    public long SupBrId { get; set; }

    public long SupbrBrandId { get; set; }

    public long Supbrlocation { get; set; }

    public long SupbrMaxPkno { get; set; }

    public long SupBrSupplierId { get; set; }

    public DateTime RecordCreated { get; set; }

    public DateTime RecordModified { get; set; }

    public long UserId { get; set; }

    public long? LastModified { get; set; }

    public byte[] TimeStamp { get; set; } = null!;
}
