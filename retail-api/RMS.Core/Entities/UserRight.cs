using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class UserRight
{
    public long UserRightId { get; set; }

    public long UserId { get; set; }

    public long MenuId { get; set; }

    public bool? CanView { get; set; }

    public bool? CanAdd { get; set; }

    public bool? CanEdit { get; set; }

    public bool? CanDelete { get; set; }

    public bool? CanPrint { get; set; }

    public bool? CanPreview { get; set; }

    public long? CompanyLocation { get; set; }

    public DateTime? RecordCreated { get; set; }

    public DateTime? RecordModified { get; set; }

    public bool? CanChangeDateonSales { get; set; }

    public bool? CanChangePaymentMode { get; set; }
}
