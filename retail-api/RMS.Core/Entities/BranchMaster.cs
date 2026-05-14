using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class BranchMaster
{
    public long BranchId { get; set; }

    public string BranchName { get; set; } = null!;

    public string BranchLocation { get; set; } = null!;

    public string BranchDatabase { get; set; } = null!;

    public string? BranchServer { get; set; }

    public bool? IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }
}
