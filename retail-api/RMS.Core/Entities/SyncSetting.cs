using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class SyncSetting
{
    public int SyncId { get; set; }

    public string TableName { get; set; } = null!;

    public int? SyncIntervalMinutes { get; set; }

    public DateTime? LastSyncAt { get; set; }

    public bool? IsActive { get; set; }
}
