using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class BackupPath
{
    public string Key { get; set; } = null!;

    public string Path { get; set; } = null!;

    public DateTime? BackupDate { get; set; }

    public DateTime? BackupTime { get; set; }

    public string? BackupDay { get; set; }

    public DateTime? LastBackupDate { get; set; }
}
