using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class CloudUploadLock
{
    public string LockId { get; set; } = null!;

    public string LockType { get; set; } = null!;

    public string MachineName { get; set; } = null!;

    public DateTime AcquiredAt { get; set; }

    public DateTime ExpiresAt { get; set; }

    public DateTime? CreatedAt { get; set; }
}
