using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class City
{
    public long CityId { get; set; }

    public string CityName { get; set; } = null!;

    public long CityStateId { get; set; }

    public DateTime CityRecordCreated { get; set; }

    public DateTime CityRecordModified { get; set; }

    public long CityUserId { get; set; }

    public long? CityLastModified { get; set; }

    public byte[] CityTimestamp { get; set; } = null!;

    public long? CityLocation { get; set; }

    public long? CityMaxPkno { get; set; }
}
