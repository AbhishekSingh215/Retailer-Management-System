using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class SyncErrorLog
{
    public int LogId { get; set; }

    public long? SyncId { get; set; }

    public string? TableName { get; set; }

    public long? RecordId { get; set; }

    public string? ErrorMessage { get; set; }

    public DateTime? LogDate { get; set; }
}
