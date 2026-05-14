using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class UserRole
{
    public long RoleId { get; set; }

    public string RoleName { get; set; } = null!;

    public string? RoleDescription { get; set; }

    public bool? IsActive { get; set; }

    public long? CompanyLocation { get; set; }

    public DateTime? RecordCreated { get; set; }

    public DateTime? RecordModified { get; set; }

    public virtual ICollection<UserRoleAssignment> UserRoleAssignments { get; set; } = new List<UserRoleAssignment>();
}
