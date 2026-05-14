using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class ApplicationVersion
{
    public int VersionId { get; set; }

    public string VersionNumber { get; set; } = null!;

    public DateTime? UpdateDate { get; set; }

    public string? UpdateDescription { get; set; }

    public string? AppliedBy { get; set; }

    public string? UpdateType { get; set; }
}
