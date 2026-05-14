using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class RepCustom
{
    public decimal RepNo { get; set; }

    public string? RepDesc { get; set; }

    public string? RepTtxName { get; set; }

    public string? RepPathName { get; set; }

    public decimal? RepOrderBy { get; set; }
}
