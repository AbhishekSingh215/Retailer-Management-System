using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class PaymentSubType
{
    public long PaymentSubTypeId { get; set; }

    public long PaymentSubTypePaymentId { get; set; }

    public string PaymentSubTypeName { get; set; } = null!;

    public DateTime PaymentSubTypeRecordCreated { get; set; }

    public DateTime PaymentSubTypeRecordModified { get; set; }

    public long PaymentSubTypeUserId { get; set; }

    public long? PaymentSubTypeLastModified { get; set; }

    public byte[] PaymentSubTypeTimestamp { get; set; } = null!;

    public long? PaymentSubTypeLocation { get; set; }

    public long? PaymentSubTypeMaxPkno { get; set; }

    public string? PaymentSubTypeDisplayName { get; set; }

    public long? PaymentSubTypeOrderBy { get; set; }

    public bool? DailyExpenses { get; set; }
}
