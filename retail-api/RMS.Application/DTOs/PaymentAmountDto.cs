using System;

namespace RMS.Application.DTOs;

public class PaymentAmountDto
{
    public long PaymentTypeId { get; set; }
    public string PaymentTypeName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
}
