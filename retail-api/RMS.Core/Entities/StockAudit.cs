using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class StockAudit
{
    public long AuditId { get; set; }

    public long AuditCompanyId { get; set; }

    public int AuditFinYear { get; set; }

    public long AuditLocationId { get; set; }

    public long AuditDocNo { get; set; }

    public DateTime AuditDocDate { get; set; }

    public long? AuditCreatedBy { get; set; }

    public DateTime? AuditCreatedDate { get; set; }

    public bool? AuditIsSynced { get; set; }

    public virtual ICollection<StockAuditDetail> StockAuditDetails { get; set; } = new List<StockAuditDetail>();
}
