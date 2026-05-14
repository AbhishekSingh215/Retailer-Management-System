using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class ViewCustomerOutstandingBalance
{
    public long? PurCompanyId { get; set; }

    public long? PurCompanyCount { get; set; }

    public long? PurDocno { get; set; }

    public DateTime? PurDocdate { get; set; }

    public long? PurType { get; set; }

    public long? PurCustomerId { get; set; }

    public string CustomerName { get; set; } = null!;

    public decimal? OutstandingAmount { get; set; }
}
