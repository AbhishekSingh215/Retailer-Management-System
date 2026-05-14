using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class Receipt
{
    public long ReceiptId { get; set; }

    public long? ReceiptCompanyId { get; set; }

    public long? ReceiptCompanyCount { get; set; }

    public long? ReceiptType { get; set; }

    public long? ReceiptLocation { get; set; }

    public long? ReceiptDocno { get; set; }

    public DateTime? ReceiptDocDate { get; set; }

    public long? ReceiptCustomerId { get; set; }

    public decimal? ReceiptAmount { get; set; }

    public decimal? ReceiptAdjustAmount { get; set; }

    public DateTime? ReceiptRecordCreated { get; set; }

    public DateTime? ReceiptRecordModified { get; set; }

    public long? ReceiptUserNewId { get; set; }

    public long? ReceiptLastModified { get; set; }

    public byte[]? ReceiptTimeStamp { get; set; }

    public long? ReceiptMaxPkno { get; set; }

    public long? ReceiptRefPurId { get; set; }

    public DateTime? ReceiptAdjustDate { get; set; }

    public long? ReceiptPaymentSubTypeId { get; set; }

    public long? ReceiptAdvanceId { get; set; }

    public long? ReceiptReturnId { get; set; }

    public bool? ReceiptIsAdvance { get; set; }

    public long? ReceiptLedgerId { get; set; }

    public bool ReceiptIsExpense { get; set; }

    public byte ReceiptDirection { get; set; }

    public string? ReceiptNotes { get; set; }

    public long? ReceiptTransferGroupId { get; set; }
}
