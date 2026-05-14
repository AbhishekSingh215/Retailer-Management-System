using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class StockAuditDetail
{
    public long AuditDetailId { get; set; }

    public long AuditDetailAuditId { get; set; }

    public string AuditDetailBarcodeId { get; set; } = null!;

    public long AuditDetailProductId { get; set; }

    public string? AuditDetailProductName { get; set; }

    public string? AuditDetailColor { get; set; }

    public string? AuditDetailSize { get; set; }

    public decimal AuditDetailSystemQty { get; set; }

    public decimal AuditDetailScannedQty { get; set; }

    public decimal AuditDetailDifference { get; set; }

    public virtual StockAudit AuditDetailAudit { get; set; } = null!;
}
