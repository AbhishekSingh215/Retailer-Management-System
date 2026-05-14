using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class ShortcutKey
{
    public int ShortcutId { get; set; }

    public string? ShortcutName { get; set; }

    public bool? IsCtrl { get; set; }

    public bool? IsAlt { get; set; }

    public bool? IsShift { get; set; }

    public string? KeyChar { get; set; }

    public string? ShortcutType { get; set; }
}
