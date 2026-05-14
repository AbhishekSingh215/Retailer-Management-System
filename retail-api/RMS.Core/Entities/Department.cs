using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Department
{
    public long DeptId { get; set; }

    public string DeptCode { get; set; } = null!;

    public string? DeptDescription { get; set; }

    public bool? DeptDeactive { get; set; }

    public DateTime? DeptRecordCreated { get; set; }

    public DateTime? DeptRecordModified { get; set; }

    public long? DeptUserId { get; set; }

    public long? DeptLastModified { get; set; }

    public byte[] DeptTimeStamp { get; set; } = null!;

    public long? DeptLocation { get; set; }

    public long? DeptMaxPkno { get; set; }
}
