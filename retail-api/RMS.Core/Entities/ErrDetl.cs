using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class ErrDetl
{
    public decimal ErrAuto { get; set; }

    public string? ErrNum { get; set; }

    public string? ErrDesc { get; set; }

    public string? ErrFrm { get; set; }

    public string? ErrModule { get; set; }

    public DateTime? ErrDate { get; set; }

    public string? ErrBackup { get; set; }

    public string? ErrEvent { get; set; }
}
