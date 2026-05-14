using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Country
{
    public long CountryId { get; set; }

    public string CountryName { get; set; } = null!;

    public DateTime CountryRecordCreated { get; set; }

    public DateTime CountryRecordModified { get; set; }

    public long CountryUserId { get; set; }

    public long? CountryLastModified { get; set; }

    public byte[] CountryTimestamp { get; set; } = null!;

    public long? CountryLocation { get; set; }

    public long? CountryMaxPkno { get; set; }
}
