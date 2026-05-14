using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class SystemAmcDatum
{
    public string ConfigKey { get; set; } = null!;

    public string? ConfigValue { get; set; }
}
