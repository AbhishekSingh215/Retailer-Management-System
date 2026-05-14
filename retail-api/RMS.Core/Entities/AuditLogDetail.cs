using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class AuditLogDetail
{
    public long AuditDetailId { get; set; }

    public long AuditId { get; set; }

    public string ColumnName { get; set; } = null!;

    public string? OldValue { get; set; }

    public string? NewValue { get; set; }

    public virtual AuditLog Audit { get; set; } = null!;
}
