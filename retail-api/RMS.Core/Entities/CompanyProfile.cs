using System;
using System.Collections.Generic;

namespace RMS.Core.Entities;

public partial class CompanyProfile
{
    public long CompanyId { get; set; }

    public string CompanyName { get; set; } = null!;

    public string? CompanyAddress1 { get; set; }

    public string? CompanyAddress2 { get; set; }

    public string? CompanyAddress3 { get; set; }

    public long? CompanyStateNo { get; set; }

    public string? ComapnyGstinNo { get; set; }

    public string? CompanyGstCode { get; set; }

    public long? CompanyCityNo { get; set; }

    public long CompanyLocation { get; set; }

    public long CompanyBarcodeId { get; set; }

    public DateTime? CompanyFinFromDate { get; set; }

    public DateTime? CompanyFinToDate { get; set; }

    public string? CompanyCount { get; set; }

    public bool? CompanyShowSelPrice { get; set; }

    public bool? CompanyRateRoundoff { get; set; }

    public long? CompanyGstType { get; set; }

    public string? CompanyPanNo { get; set; }

    public long? CompanyPincode { get; set; }

    public string? CompanyEmailId { get; set; }

    public bool? CompanySourcecodeWiseEntry { get; set; }

    public bool? CompanySalesmanRequired { get; set; }

    public string? CompanyFtpDetails { get; set; }

    public string? CompanyFtpUserName { get; set; }

    public string? CompanyFtpPassword { get; set; }

    public string? CompanyFtpDirectory { get; set; }

    public string? CompanyWhatsappUserName { get; set; }

    public string? CompanyWhatsappToken { get; set; }

    public string? CompanyWhatsappMobileNo { get; set; }

    public long? CompanyBillPrintNo { get; set; }

    public long? CompanyDefaultRackNo { get; set; }

    public bool? CompanyRequireSalesPerson { get; set; }

    public bool? CompanySendSalesWhatsapp { get; set; }

    public bool? CompanySendOrderWhatsapp { get; set; }

    public long? CompanyOrderPrintNo { get; set; }

    public bool? CompanyAllowNegativeEntry { get; set; }

    public bool? CompanyOrderItemwise { get; set; }

    public bool? CompanyBillonCredit { get; set; }

    public string? CompanyPhoneNo { get; set; }

    public bool? CompanyAllowQtyInDecimal { get; set; }

    public string? CompanyMobileNo { get; set; }

    public int? CompanyBarcodeType { get; set; }

    public string? CompanyUpiId { get; set; }

    public string? CompanyBillPrintMessage { get; set; }

    public long? CompanyClientId { get; set; }

    public bool? CompanyPurchaseRoundOff { get; set; }

    public string? CompanyNegativeSourcecode { get; set; }

    public decimal? CompanyDefaultDiscountPercent { get; set; }

    public bool? CompanySendWhatsappOnOwnerNumber { get; set; }

    public bool? CompanyAllowNegatvieEntry { get; set; }

    public bool? CompanyRequireSubSize { get; set; }

    public bool? CompanyCostWoTax { get; set; }

    public long? CompanyWhatsappType { get; set; }

    public bool? CompanyShowPurchaseMatrixwise { get; set; }

    public bool? CompanyPurchaseVerify { get; set; }

    public bool? CompanySalespersonCompulsory { get; set; }

    public bool? CompanyServiceStop { get; set; }

    public string? CompanySmtpHost { get; set; }

    public int? CompanySmtpPort { get; set; }

    public string? CompanySmtpEmailId { get; set; }

    public string? CompanyEmailPassword { get; set; }

    public bool? CompanyEnableSsl { get; set; }

    public DateTime? InstallationDate { get; set; }

    public DateTime? DueDate { get; set; }

    public long? BillAmount { get; set; }

    public long? ReceivedAmount { get; set; }

    public long? OsAmount { get; set; }

    public bool? ServiceStop { get; set; }

    public bool? CompanyStockAudit { get; set; }

    public long? CompanySalesmanPointType { get; set; }

    public bool? IsMainCompany { get; set; }

    public int? CompanyType { get; set; }

    public string? ParentLocation { get; set; }

    public bool? CompanyScanToSaveAndEdit { get; set; }

    public bool? CompanyOpeningStock { get; set; }

    public bool? CompanyEnableChargeProvision { get; set; }
}
