using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class WhatsAppTemplate
{
    public long TemplateId { get; set; }

    public string? TemplateName { get; set; }

    public string? MessageContent { get; set; }

    public string? TemplateType { get; set; }

    public bool? IsActive { get; set; }

    public long? TemplateLocation { get; set; }

    public long? TemplateMaxPkno { get; set; }

    public DateTime? TemplateRecordCreated { get; set; }

    public DateTime? TemplateRecordModified { get; set; }
}
