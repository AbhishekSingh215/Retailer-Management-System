using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class AuditLog
{
    public long AuditId { get; set; }

    public string TableName { get; set; } = null!;

    public long? RecordId { get; set; }

    public string Operation { get; set; } = null!;

    public long? ChangedBy { get; set; }

    public DateTime ChangedAt { get; set; }

    public string? Notes { get; set; }

    public virtual ICollection<AuditLogDetail> AuditLogDetails { get; set; } = new List<AuditLogDetail>();
}
