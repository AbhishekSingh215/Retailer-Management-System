using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class CustomerOutstandingIndex
{
    public int Id { get; set; }

    public bool OptimizationApplied { get; set; }

    public DateTime? AppliedDate { get; set; }
}
