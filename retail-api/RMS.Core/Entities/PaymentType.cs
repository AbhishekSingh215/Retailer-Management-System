using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class PaymentType
{
    public long PaymentTypeId { get; set; }

    public string PaymentTypeName { get; set; } = null!;

    public DateTime PaymentTypeRecordCreated { get; set; }

    public DateTime PaymentTypeRecordModified { get; set; }

    public long PaymentTypeUserId { get; set; }

    public long? PaymentTypeLastModified { get; set; }

    public byte[] PaymentTypeTimestamp { get; set; } = null!;

    public bool? PaymentTypeRequireSubType { get; set; }

    public long? PaymentTypeLocation { get; set; }

    public long? PaymentTypeMaxPkno { get; set; }

    public bool? PaymentTypeDefault { get; set; }

    public bool? PaymentisMod { get; set; }
}
