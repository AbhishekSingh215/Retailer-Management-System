using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class ProductMaster
{
    public long ProductId { get; set; }

    public string? ProductCode { get; set; }

    public string? ProductDesc { get; set; }

    public long? ProductCtId { get; set; }

    public bool? ProductIndividualBarcode { get; set; }

    public bool? ProductNoStockChecking { get; set; }

    public long? ProductSizeId { get; set; }

    public bool? ProductMarkDown { get; set; }

    public long? ProductSupplierId { get; set; }

    public long? ProductHsnId { get; set; }

    public long? ProductUntNo { get; set; }

    public long? ProductBrandId { get; set; }

    public string? ProductComments { get; set; }

    public string? ProductComments2 { get; set; }

    public DateTime? ProductRecordCreated { get; set; }

    public DateTime? ProductRecordModified { get; set; }

    public long? ProductUserId { get; set; }

    public long? ProductLastModified { get; set; }

    public byte[]? ProductTimeStamp { get; set; }

    public long? ProductMaxPkNo { get; set; }

    public decimal? ProductRateDiff { get; set; }

    public decimal? ProductMrpDiff { get; set; }

    public string? ProductFromSize { get; set; }

    public string? ProductToSize { get; set; }

    public string? ProductMiddleSize { get; set; }

    public long? ProductLocation { get; set; }

    public bool? ProductDeactive { get; set; }

    public decimal? ProductRate { get; set; }

    public decimal? ProductMrp { get; set; }

    public decimal? ProductSelPrice { get; set; }

    public decimal? ProductMarkUp { get; set; }

    public decimal? ProductSelPricePercent { get; set; }

    public decimal? ProductSelPriceDiscPercent { get; set; }
}
