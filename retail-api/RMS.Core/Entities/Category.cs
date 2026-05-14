using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Category
{
    public long CategoryId { get; set; }

    public string CategoryCode { get; set; } = null!;

    public string? CategoryDescription { get; set; }

    public bool? CategoryDeactive { get; set; }

    public DateTime? CategoryRecordCreated { get; set; }

    public DateTime? CategoryRecordModified { get; set; }

    public long? CategoryUserId { get; set; }

    public long? CategoryLastModified { get; set; }

    public byte[] CategoryTimeStamp { get; set; } = null!;

    public long? CategoryLocation { get; set; }

    public long? CategoryMaxPkno { get; set; }

    public long? CategoryDeptId { get; set; }

    public long? CategoryHsnId { get; set; }

    public long? CategorySizeId { get; set; }
}
