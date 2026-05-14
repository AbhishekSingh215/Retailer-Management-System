using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class ExcelColumnMapping
{
    public long MappingId { get; set; }

    public long? SupplierId { get; set; }

    public string? ExcelColumnName { get; set; }

    public string? SystemFieldName { get; set; }

    public long? MappingLocation { get; set; }

    public DateTime? MappingCreated { get; set; }

    public DateTime? MappingModified { get; set; }

    public string? MappingType { get; set; }

    public bool? MappingIsOpening { get; set; }
}
