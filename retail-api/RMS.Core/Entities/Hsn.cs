using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Hsn
{
    public long HsnId { get; set; }

    public string HsnCode { get; set; } = null!;

    public string HsnDescription { get; set; } = null!;

    public DateTime HsnRecordCreated { get; set; }

    public DateTime HsnRecordModified { get; set; }

    public long HsnUserId { get; set; }

    public long? HsnLastModified { get; set; }

    public byte[] HsnTimestamp { get; set; } = null!;

    public long? HsnLocation { get; set; }

    public long? HsnMaxPkno { get; set; }

    public bool? HsnDeactive { get; set; }

    public DateTime? HsnWefDate { get; set; }

    public DateTime? HsnWefToDate { get; set; }
}
