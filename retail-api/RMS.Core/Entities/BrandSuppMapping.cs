using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class BrandSuppMapping
{
    public int BrandSupId { get; set; }

    public int BrandBrdId { get; set; }

    public int BrandSupplierId { get; set; }
}
