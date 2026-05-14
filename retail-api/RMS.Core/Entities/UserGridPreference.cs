using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class UserGridPreference
{
    public long PreferenceId { get; set; }

    public long UserId { get; set; }

    public string FormName { get; set; } = null!;

    public string GridName { get; set; } = null!;

    public string ColumnName { get; set; } = null!;

    public bool IsVisible { get; set; }

    public int ColumnWidth { get; set; }

    public int DisplayIndex { get; set; }

    public DateTime CreatedDate { get; set; }

    public DateTime ModifiedDate { get; set; }
}
