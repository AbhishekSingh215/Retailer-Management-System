using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class ExpenseTransferLog
{
    public long TransferId { get; set; }

    public long FromReceiptId { get; set; }

    public long ToReceiptId { get; set; }

    public DateTime TransferDate { get; set; }

    public long? UserId { get; set; }

    public string? Notes { get; set; }
}
