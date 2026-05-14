using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class MenuRight
{
    public long MenuRightId { get; set; }

    public string FormName { get; set; } = null!;

    public string MenuName { get; set; } = null!;

    public string? MenuPath { get; set; }

    public bool? IsActive { get; set; }

    public long? CompanyLocation { get; set; }

    public DateTime? RecordCreated { get; set; }

    public DateTime? RecordModified { get; set; }
}
