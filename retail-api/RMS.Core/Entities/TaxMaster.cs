using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class TaxMaster
{
    public long TaxId { get; set; }

    public string? TaxDescription { get; set; }

    public bool? TaxDeactive { get; set; }

    public decimal? TaxRate { get; set; }

    public decimal? TaxCgst { get; set; }

    public decimal? TaxIgst { get; set; }

    public decimal? TaxUgst { get; set; }

    public int? TaxType { get; set; }

    public DateTime? TaxRecordCreated { get; set; }

    public DateTime? TaxRecordModified { get; set; }

    public long? TaxUserId { get; set; }

    public long? TaxLastModified { get; set; }

    public byte[] TaxTimeStamp { get; set; } = null!;

    public long? TaxLocation { get; set; }

    public long? TaxMaxPkno { get; set; }

    public decimal? TaxSgst { get; set; }
}
