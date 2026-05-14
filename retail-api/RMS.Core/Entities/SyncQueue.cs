using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class SyncQueue
{
    public long SyncId { get; set; }

    public string? TableName { get; set; }

    public long? RecordId { get; set; }

    public string? SyncType { get; set; }

    public bool? IsSynced { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int? RetryCount { get; set; }
}
