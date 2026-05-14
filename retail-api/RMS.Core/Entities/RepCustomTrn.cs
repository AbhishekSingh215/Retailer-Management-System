using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class RepCustomTrn
{
    public decimal RctNo { get; set; }

    public decimal? RctRepNo { get; set; }

    public string? RctDesc { get; set; }

    public string? RctFileName { get; set; }

    public int? RctOrder { get; set; }

    public string? RctUserOrder { get; set; }

    public string? RctInactive { get; set; }

    public decimal? RctReportType { get; set; }
}
