using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class CustomerGroup
{
    public long CgId { get; set; }

    public string CgCode { get; set; } = null!;

    public string? CgDescription { get; set; }

    public bool? CgDeactive { get; set; }

    public DateTime? CgRecordCreated { get; set; }

    public DateTime? CgRecordModified { get; set; }

    public long? CgUserId { get; set; }

    public long? CgLastModified { get; set; }

    public byte[] CgTimeStamp { get; set; } = null!;

    public long? CgLocation { get; set; }

    public long? CgMaxPkno { get; set; }
}
