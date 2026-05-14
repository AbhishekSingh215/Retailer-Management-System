using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class MasterUser
{
    public long UserId { get; set; }

    public string? UserName { get; set; }

    public string? UserPassword { get; set; }

    public DateTime? UserCreated { get; set; }

    public DateTime? UserModified { get; set; }

    public byte[]? UserTimestamp { get; set; }

    public string? UserRemarks { get; set; }

    public bool? NoBackdateView { get; set; }

    public bool? NoDateChangeonReceipt { get; set; }

    public bool? CanShowDashboard { get; set; }

    public bool? NoDiscountAllowed { get; set; }

    public bool? NoExchangeProvision { get; set; }

    public bool? NoLastPrintOut { get; set; }

    public string? DashboardChartType { get; set; }

    public bool? IsActive { get; set; }

    public bool? NoProfitOnDashboard { get; set; }

    public virtual ICollection<UserRoleAssignment> UserRoleAssignments { get; set; } = new List<UserRoleAssignment>();
}
