using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class PaymentDetail
{
    public long PaymentDetailId { get; set; }

    public long PaymentId { get; set; }

    public long PurchaseId { get; set; }

    public decimal AdjustAmount { get; set; }

    public long? PaymentDetailCompanyCount { get; set; }

    public long? PaymentDetailCompanyLocation { get; set; }

    public long? PaymentDetailMaxPkno { get; set; }

    public long? PaymentDetailCompanyId { get; set; }

    public long? LinkedDebitNoteId { get; set; }

    public long? PaymentTypeId { get; set; }

    public bool IsOpeningBalance { get; set; }

    public long? OpeningBalanceId { get; set; }
}
