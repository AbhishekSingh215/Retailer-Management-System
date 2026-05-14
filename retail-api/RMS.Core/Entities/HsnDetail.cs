using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class HsnDetail
{
    public long HsdId { get; set; }

    public long HsdHsnId { get; set; }

    public decimal HsdSlabAmount { get; set; }

    public long HsdLowerSlabTax1 { get; set; }

    public long HsdLowerSlabTax2 { get; set; }

    public long HsdSlabTax1 { get; set; }

    public long HsdSlabTax2 { get; set; }

    public DateTime? HsdRecordCreated { get; set; }

    public DateTime? HsdRecordModified { get; set; }

    public long? HsdUserId { get; set; }

    public long? HsdLastModified { get; set; }

    public long? HsdLocation { get; set; }

    public DateTime? HsdWefDate { get; set; }

    public long? HsdMaxPkno { get; set; }

    public DateTime? HsdDeactive { get; set; }
}
