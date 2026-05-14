using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class WhatsAppDetail
{
    public long WhatsappId { get; set; }

    public string? WhatsappMobileno { get; set; }

    public string? WhatsappMessage { get; set; }

    public string? WhatsappUrl { get; set; }

    public bool? WhatsappStatus { get; set; }

    public string? WhatsappRemarks { get; set; }

    public DateTime? WhatsappDate { get; set; }

    public long? WhatsappTemplateId { get; set; }
}
