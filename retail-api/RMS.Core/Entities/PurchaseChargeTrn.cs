using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class PurchaseChargeTrn
{
    public long PurcId { get; set; }

    public long? PurcPurId { get; set; }

    public long? PurcChargeId { get; set; }

    public decimal? PurcChargeRate { get; set; }

    public decimal? PurcAmount { get; set; }

    public long? PurcTaxId { get; set; }

    public decimal? PurcTaxRate1 { get; set; }

    public decimal? PurcTaxAmount1 { get; set; }

    public decimal? PurcTaxRate2 { get; set; }

    public decimal? PurcTaxAmount2 { get; set; }

    public DateTime? PurcRecordCreated { get; set; }

    public DateTime? PurcRecordModified { get; set; }

    public long? PurcMaxPkno { get; set; }

    public long? PurcLocation { get; set; }

    public long? PurcHsnId { get; set; }

    public decimal? PurcReverseTaxAmount1 { get; set; }

    public decimal? PurcReverseTaxAmount2 { get; set; }
}
