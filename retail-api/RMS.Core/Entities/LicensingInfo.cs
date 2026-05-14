using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class LicensingInfo
{
    public long CompanyId { get; set; }

    public long ClientId { get; set; }

    public DateTime InstallationDate { get; set; }

    public DateTime DueDate { get; set; }

    public long BillAmount { get; set; }

    public long ReceivedAmount { get; set; }

    public long OsAmount { get; set; }

    public bool ServiceStop { get; set; }

    public DateTime? LastCloudSync { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}
