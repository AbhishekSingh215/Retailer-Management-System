using System;

namespace RMS.Application.DTOs;

public class CreditNoteAdjustmentDto
{
    public long PurId { get; set; }
    public decimal PurAdjustAmount { get; set; }
}
