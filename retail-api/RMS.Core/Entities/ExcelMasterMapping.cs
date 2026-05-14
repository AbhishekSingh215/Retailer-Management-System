using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class ExcelMasterMapping
{
    public long MappingId { get; set; }

    public long SupplierId { get; set; }

    public string ExcelValue { get; set; } = null!;

    public string MasterTableName { get; set; } = null!;

    public long MappedId { get; set; }

    public string MappedName { get; set; } = null!;

    public DateTime? RecordCreated { get; set; }

    public DateTime? LastUsed { get; set; }
}
