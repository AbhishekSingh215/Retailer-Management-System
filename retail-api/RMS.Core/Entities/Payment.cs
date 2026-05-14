using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Payment
{
    public long PaymentId { get; set; }

    public DateTime PaymentDate { get; set; }

    public int PaymentTypeId { get; set; }

    public long CustomerId { get; set; }

    public decimal TotalAmount { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int CreatedBy { get; set; }

    public long? PaymentCompanyId { get; set; }

    public long? PaymentCompanyCount { get; set; }

    public long? PaymentLocation { get; set; }

    public long? PaymentMaxPkno { get; set; }
}
