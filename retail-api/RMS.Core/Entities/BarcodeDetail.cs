using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class BarcodeDetail
{
    public long? BarcodeId { get; set; }

    public long? BarcodeProductId { get; set; }

    public long? BarcodeBrandId { get; set; }

    public long? BarcodeColorId { get; set; }

    public string? BarcodeSize { get; set; }

    public long? BarcodeCompanyId { get; set; }

    public long? BarcodeLocation { get; set; }

    public long? BarcodeSupplierId { get; set; }

    public decimal? BarcodeMrp { get; set; }

    public decimal? BarcodeRate { get; set; }

    public decimal? BarcodeCostPerQty { get; set; }

    public string? BarcodeCostCode { get; set; }

    public decimal? BarcodeBaseCost { get; set; }

    public decimal? BarcodeCostWot { get; set; }

    public decimal? BarcodeValue { get; set; }

    public string? BarcodeSourceBarcode { get; set; }

    public DateTime? BarcodeRecordCreated { get; set; }

    public DateTime? BarcodeRecordModified { get; set; }

    public long? BarcodeUserId { get; set; }

    public long? BarcodeLastModified { get; set; }

    public long? BarcodeMaxPkno { get; set; }

    public long? BarcodeDocNo { get; set; }

    public long? BarcodeStockType { get; set; }

    public string? BarcodeType { get; set; }

    public string? BarcodeTransactionDetails { get; set; }

    public string? BarcodeRemarks { get; set; }

    public long? BarcodeSizeId { get; set; }

    public long? BarcodeDesc { get; set; }

    public long? BarocodeParentId { get; set; }

    public decimal? BarcodeSelPrice { get; set; }

    public decimal? BarcodePerTaxValue1 { get; set; }

    public decimal? BarcodePerTaxValue2 { get; set; }

    public long? BarcodeSubSizeId { get; set; }

    public decimal? BarcodeSalesmanPoints { get; set; }
}
