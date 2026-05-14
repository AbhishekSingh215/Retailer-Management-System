using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class MenuForm
{
    public long MenuId { get; set; }

    public string MenuName { get; set; } = null!;

    public string FormName { get; set; } = null!;

    public string? MenuPath { get; set; }

    public string? Category { get; set; }

    public bool? IsActive { get; set; }

    public long? MenuLocation { get; set; }

    public long? MenuMaxPkno { get; set; }

    public DateTime? RecordCreated { get; set; }

    public DateTime? RecordModified { get; set; }
}
