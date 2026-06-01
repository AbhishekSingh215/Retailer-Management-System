public class BarcodeScanResponse
{
    public string Barcodedesc { get; set; }
    public string BarcodeSourceBarcode { get; set; }
    public string ProductCode { get; set; }
    public string CategoryDescription { get; set; }
    public string ColorName { get; set; }
    public string BarcodeSize { get; set; }
    public string ProductIndividualBarcode { get; set; }
    public decimal BarcodeMrp { get; set; }
    public decimal BarcodeSelPrice { get; set; }
    public string HsnCode { get; set; }
    public long? HsnId { get; set; }
    public decimal? TaxRate { get; set; }
    public string? TaxDesc { get; set; }
    public long? TaxId { get; set; }
    public long BarcodeId { get; set; }
    public bool ProductNoStockChecking { get; set; }
    public decimal AvailableStock { get; set; }
}
