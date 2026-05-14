using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class UserPermission
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public string? FormName { get; set; }

    public bool? CanEdit { get; set; }

    public bool? CanCreateNew { get; set; }

    public bool? CanDisplay { get; set; }

    public bool? CanPrint { get; set; }
}
