using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class UserRoleAssignment
{
    public long AssignmentId { get; set; }

    public long UserId { get; set; }

    public long RoleId { get; set; }

    public long? CompanyLocation { get; set; }

    public DateTime? RecordCreated { get; set; }

    public DateTime? RecordModified { get; set; }

    public virtual UserRole Role { get; set; } = null!;

    public virtual MasterUser User { get; set; } = null!;
}
