using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class ProductColor
{
    public long Pcid { get; set; }

    public long? PcColorId { get; set; }

    public long? PcProductId { get; set; }

    public DateTime PcRecordCreated { get; set; }

    public DateTime PcRecordModified { get; set; }

    public long PcUserId { get; set; }

    public long? PclastModified { get; set; }

    public byte[] Pctimestamp { get; set; } = null!;

    public long? Pclocation { get; set; }

    public long? PcMaxPkno { get; set; }
}
