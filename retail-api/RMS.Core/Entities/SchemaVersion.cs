using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class SchemaVersion
{
    public int ChangeId { get; set; }

    public string? ChangeType { get; set; }

    public string? ObjectName { get; set; }

    public string? ChangeDescription { get; set; }

    public string? ChangeDataType { get; set; }

    public DateTime? ChangeDate { get; set; }

    public string? Status { get; set; }

    public string? VersionNumber { get; set; }

    public DateTime? AppliedDate { get; set; }

    public string? AppliedBy { get; set; }

    public string? ErrorMessage { get; set; }
}
