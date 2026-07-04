using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;

namespace RMS.CrystalReportsRunner
{
    class Program
    {
        static int Main(string[] args)
        {
            // System.Diagnostics.Debugger.Launch();
            if (args.Length < 3)
            {
                Console.Error.WriteLine("Error: Missing arguments.");
                Console.Error.WriteLine("Usage (Legacy Mode) : RMS.CrystalReportsRunner.exe <purId> <rptFilePath> <pdfOutputPath> <connectionString>");
                Console.Error.WriteLine("Usage (Generic Mode): RMS.CrystalReportsRunner.exe <rptFilePath> <pdfOutputPath> <mainDataXmlPath> [<subreportName1>=<subreportDataXmlPath1> ...]");
                return 1;
            }

            bool isLegacyMode = false;
            long purId = 0;
            if (args.Length == 4 && long.TryParse(args[0], out purId) && !args[2].EndsWith(".xml", StringComparison.OrdinalIgnoreCase))
            {
                isLegacyMode = true;
            }

            string rptFilePath = isLegacyMode ? args[1] : args[0];
            string pdfOutputPath = isLegacyMode ? args[2] : args[1];

            if (!File.Exists(rptFilePath))
            {
                Console.Error.WriteLine("Error: Report file not found at " + rptFilePath);
                return 1;
            }

            try
            {
                Console.WriteLine("Initializing Crystal Reports 8.5 Application...");
                Type appType = Type.GetTypeFromProgID("CrystalRuntime.Application");
                if (appType == null)
                {
                    Console.Error.WriteLine("Error: Crystal Reports 8.5 runtime (CrystalRuntime.Application) is not registered on this system.");
                    return 1;
                }

                dynamic app = Activator.CreateInstance(appType);

                Console.WriteLine("Loading report: " + rptFilePath);
                dynamic report = app.OpenReport(rptFilePath);

                DataTable salesData;
                DataTable taxData = null;
                var subreportXmlMappers = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

                if (isLegacyMode)
                {
                    string connectionString = args[3];
                    Console.WriteLine("Executing query for PurId: " + purId);
                    salesData = GetSalesDataForReport(purId, connectionString);
                    
                    if (salesData.Rows.Count == 0)
                    {
                        Console.Error.WriteLine("Error: No database records found for PurId: " + purId);
                        return 1;
                    }

                    Console.WriteLine($"Retrieved {salesData.Rows.Count} items.");
                    Console.WriteLine("Executing tax summary query for subreport...");
                    taxData = GetTaxDataForSubreport(purId, connectionString);
                    Console.WriteLine($"Retrieved {taxData.Rows.Count} tax rows for subreport.");
                }
                else
                {
                    string mainDataXmlPath = args[2];
                    if (!File.Exists(mainDataXmlPath))
                    {
                        Console.Error.WriteLine("Error: Main report data XML file not found at " + mainDataXmlPath);
                        return 1;
                    }

                    salesData = new DataTable();
                    salesData.ReadXml(mainDataXmlPath);
                    Console.WriteLine($"Loaded {salesData.Rows.Count} main report rows from XML.");

                    for (int i = 3; i < args.Length; i++)
                    {
                        string arg = args[i];
                        int eqIdx = arg.IndexOf('=');
                        if (eqIdx > 0)
                        {
                            string subName = arg.Substring(0, eqIdx);
                            string xmlPath = arg.Substring(eqIdx + 1);
                            subreportXmlMappers[subName] = xmlPath;
                        }
                    }
                }

                // Step 1: Discard any data Crystal cached inside the .rpt file itself.
                // Without this, Crystal uses its saved data and ignores SetDataSource entirely.
                try { report.DiscardSavedData(); } catch { }

                // Step 2: Bind main report data.
                // Create a FRESH recordset right before binding — never reuse one that may have been advanced.
                Console.WriteLine("Binding main report data...");
                string schemaText = "";
                string objectLog = "";
                dynamic recordset = ConvertToAdoRecordset(salesData);
                foreach (dynamic table in report.Database.Tables)
                {
                    schemaText += $"Table Name: {table.Name}, Location: {table.Location}\r\n";
                    table.SetDataSource(recordset, 3); // 3 = crDefaultSourceType
                }
                try { recordset.MoveFirst(); } catch { }
                objectLog += $"Main recordset bound ({salesData.Rows.Count} rows).\r\n";

                // Step 3: Bind subreport data.
                // Crystal 8.5: Kind=5 = subreport. Kind=9 = OLE/picture object (no SubreportName).
                Console.WriteLine("Binding subreport data...");
                try
                {
                    foreach (dynamic section in report.Sections)
                    {
                        objectLog += $"Section: {section.Name}\r\n";
                        foreach (dynamic obj in section.ReportObjects)
                        {
                            int objKind = (int)obj.Kind;
                            objectLog += $"  Object: Name='{obj.Name}', Kind={objKind}\r\n";
                            if (objKind == 5)
                            {
                                string subreportName;
                                try { subreportName = obj.SubreportName; }
                                catch { objectLog += $"    Skipping: no SubreportName on '{obj.Name}'.\r\n"; continue; }

                                objectLog += $"    --> Found subreport: {subreportName}\r\n";
                                dynamic subreport = report.OpenSubreport(subreportName);

                                // Discard cached data in the subreport too
                                try { subreport.DiscardSavedData(); } catch { }

                                DataTable subreportData = null;
                                if (isLegacyMode)
                                {
                                    if (subreportName.Equals("BillTaxDetailsSubReport", StringComparison.OrdinalIgnoreCase))
                                    {
                                        subreportData = taxData;
                                    }
                                }
                                else
                                {
                                    if (subreportXmlMappers.TryGetValue(subreportName, out string xmlPath) && File.Exists(xmlPath))
                                    {
                                        subreportData = new DataTable();
                                        subreportData.ReadXml(xmlPath);
                                    }
                                }

                                if (subreportData != null)
                                {
                                    dynamic subRecordset = ConvertToAdoRecordset(subreportData);
                                    foreach (dynamic subTable in subreport.Database.Tables)
                                    {
                                        schemaText += $"  Subreport Table: {subTable.Name}\r\n";
                                        subTable.SetDataSource(subRecordset, 3);
                                        objectLog += $"    Bound subreport table '{subTable.Name}' with {subreportData.Rows.Count} rows.\r\n";
                                    }
                                    try { subRecordset.MoveFirst(); } catch { }
                                }
                                else
                                {
                                    objectLog += $"    No data bound for subreport '{subreportName}'.\r\n";
                                }
                            }
                        }
                    }
                }
                catch (Exception subEx)
                {
                    objectLog += $"ERROR binding subreport: {subEx.Message}\r\n";
                }

                // Step 4: CRITICAL — After subreport binding, Crystal 8.5 may advance the main
                // recordset's internal pointer. Create a brand-new fresh recordset and re-bind
                // the main tables one final time right before Export.
                Console.WriteLine("Re-binding main report with fresh recordset before export...");
                dynamic freshRecordset = ConvertToAdoRecordset(salesData);
                foreach (dynamic table in report.Database.Tables)
                {
                    table.SetDataSource(freshRecordset, 3);
                }
                try { freshRecordset.MoveFirst(); } catch { }
                objectLog += "Final fresh main recordset bound and rewound.\r\n";

                File.WriteAllText(@"C:\RMS\Reports\report_objects.txt", objectLog);
                try { File.WriteAllText(@"C:\RMS\Reports\report_schema.txt", schemaText); } catch { }

                try
                {
                    File.WriteAllText(@"C:\RMS\Reports\report_schema.txt", schemaText);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Could not write schema file: " + ex.Message);
                }

                // Set export details
                Console.WriteLine("Exporting report to PDF: " + pdfOutputPath);
                dynamic exportOptions = report.ExportOptions;
                exportOptions.DiskFileName = pdfOutputPath;
                exportOptions.DestinationType = 1; // crEDTDiskFile = 1
                exportOptions.FormatType = 31; // crEFTPortableDocFormat = 31 (PDF)

                Console.WriteLine("Starting export...");
                Console.WriteLine("Output File : " + pdfOutputPath);

                report.Export(false); // false = do not show prompt dialog

                Console.WriteLine("Export completed.");

                Console.WriteLine("PDF Exists : " + File.Exists(pdfOutputPath));

                if (File.Exists(pdfOutputPath))
                {
                    Console.WriteLine("PDF Size : " + new FileInfo(pdfOutputPath).Length);
                }

                Console.WriteLine("Report successfully generated.");
                return 0;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine("Error during report generation process.");
                Console.Error.WriteLine(ex.Message);
                Console.Error.WriteLine(ex.StackTrace);

                // Crystal 8.5 sometimes throws after creating the PDF successfully.
                if (File.Exists(pdfOutputPath))
                {
                    FileInfo fileInfo = new FileInfo(pdfOutputPath);

                    if (fileInfo.Length > 0)
                    {
                        Console.WriteLine("Warning: Crystal threw an exception but the PDF was created successfully.");
                        return 0;
                    }
                }

                return 1;
            }
        }

        private static dynamic ConvertToAdoRecordset(DataTable dt)
        {
            Type rsType = Type.GetTypeFromProgID("ADODB.Recordset");
            if (rsType == null)
            {
                throw new Exception("ADODB.Recordset COM class is not registered on this system.");
            }

            dynamic rs = Activator.CreateInstance(rsType);

            foreach (DataColumn col in dt.Columns)
            {
                int adoType = GetAdoType(col.DataType);
                int size = (col.DataType == typeof(string)) ? 8000 : -1;
                rs.Fields.Append(col.ColumnName, adoType, size, 32); // 32 = adFldUnspecified
            }

            // Open static optimistic client-side cursor recordset
            rs.Open(System.Reflection.Missing.Value, System.Reflection.Missing.Value, 3, 4, -1); // 3 = adOpenStatic, 4 = adLockOptimistic

            foreach (DataRow row in dt.Rows)
            {
                rs.AddNew();
                foreach (DataColumn col in dt.Columns)
                {
                    var val = row[col];
                    if (val == DBNull.Value)
                    {
                        val = null;
                    }
                    rs.Fields[col.ColumnName].Value = val;
                }
                rs.Update();
            }

            return rs;
        }

        private static int GetAdoType(Type type)
        {
            if (type == typeof(int) || type == typeof(long) || type == typeof(short))
                return 3; // adInteger
            if (type == typeof(double) || type == typeof(float))
                return 5; // adDouble
            if (type == typeof(decimal))
                return 14; // adDecimal
            if (type == typeof(DateTime))
                return 7; // adDate
            if (type == typeof(bool))
                return 11; // adBoolean
            return 202; // adVarWChar
        }

        private static DataTable GetTaxDataForSubreport(long purId, string connectionString)
        {
            // This query aggregates tax data per tax slab (HSN-wise) for the BillTaxDetailsSubReport.
            // The subreport TTX schema expects: SalesId, SalesDocno, SalesTaxID, SalesTaxRate1, SalesTaxRate2, TaxableAmount, TaxAmount1, TaxAmount2
            string query = @"
            SELECT
                p.PurId AS SalesId,
                p.PurId AS SalesDocno,
                pt.PurtTaxId AS SalesTaxID,
                ISNULL(pt.PurtTaxRate1, 0) AS SalesTaxRate1,
                ISNULL(pt.PurtTaxRate2, 0) AS SalesTaxRate2,
                ISNULL(SUM(
                    (ISNULL(pt.PurtDebitQty, 0) - ISNULL(pt.PurtCreditQty, 0))
                    * ISNULL(pt.PurtRate, 0)
                    - ISNULL(pt.PurtDiscAmount, 0)
                ), 0) AS TaxableAmount,
                ISNULL(SUM(pt.PurtTaxAmount1), 0) AS TaxAmount1,
                ISNULL(SUM(pt.PurtTaxAmount2), 0) AS TaxAmount2
            FROM Purchase p
            INNER JOIN PurchaseTrn pt ON pt.PurtPurId = p.PurId
            WHERE p.PurId = @PurId
              AND ISNULL(pt.PurtTaxId, 0) > 0
            GROUP BY p.PurId, pt.PurtTaxId, pt.PurtTaxRate1, pt.PurtTaxRate2
            ORDER BY pt.PurtTaxRate1, pt.PurtTaxRate2";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.CommandTimeout = 120;
                    cmd.Parameters.AddWithValue("@PurId", purId);
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        DataTable dt = new DataTable("BillTaxDetailsSubReport");
                        da.Fill(dt);
                        return dt;
                    }
                }
            }
        }

        private static DataTable GetSalesDataForReport(long purId, string connectionString)
        {
            string query = @"
            SELECT 
                PurId AS SalesId, 
                PurDocno AS SalesDocNo, 
                PurDocDate AS SalesDocDate,
                ISNULL(CompanyName, '') AS CompanyName,
                ISNULL(CompanyAddress1, '') AS CompanyAddress1,
                ISNULL(CompanyAddress2, '') AS CompanyAddress2,
                ISNULL(ct.CityName, '') AS CompanyCityName,
                ISNULL(cs.StateName, '') AS CompanyStateName,
                ISNULL(CompanyEmailId, '') AS CompanyEmailId,
                ISNULL(ComapnyGstinNo, '') AS CompanyGstinNo,
                ISNULL(CompanyGstCode, '') AS CompanyGstCode,
                ISNULL(CompanyWhatsappMobileNo, '') AS CompanyWhatsappMobileNo,
                ISNULL(CustomerName, '') AS CustomerName,
                ISNULL(CustomerAddress1, '') AS CustomerAddress1,
                ISNULL(CustomerAddress2, '') AS CustomerAddress2,
                ISNULL(cc.CityName, '') AS CustomerCity,
                ISNULL(csn.StateName, '') AS StateName,
                ISNULL(CustomerEmailId, '') AS CustomerEmailId,
                ISNULL(CustomerMobileNo, '') AS CustomerMobileNo,
                ISNULL(CustomerMobileNo2, '') AS CustomerMobileNo2,
                ISNULL(CustomerGstNo, '') AS CustomerGstNo,
                ISNULL(CustomerPanNo, '') AS CustomerPanNo,
                PurtProductId AS SalesProductId,
                ProductCode,
                ProductDesc,
                ISNULL(ColorCode, '') AS ColorCode,
                ISNULL(ColorName, '') AS ColorName,
                ISNULL(BrandName, '') AS BrandName,
                ISNULL(CategoryCode, '') AS CategoryCode,
                ISNULL(CategoryDescription, '') AS CategoryDescription,
                ISNULL(DeptCode, '') AS DeptCode,
                ISNULL(DeptDescription, '') AS DeptDescription,
                ISNULL(HsnCode, '') AS HsnCode,
                PurtBarcodeId AS SalesBarcodeId,
                Cast(BarcodeDesc As Varchar(15)) as BarcodeDesc,
                BarcodeSourceBarcode,
                ISNULL(PurtPerQty, 0) AS SalesPerQty,
                ISNULL(PurtDebitQty, 0) AS SalesDebitQty,
                ISNULL(PurtCreditQty, 0) AS SalesCreditQty,
                ISNULL(PurtCreditAmount, 0) AS SalesCreditAmount,
                ISNULL(PurtMrp, 0) AS SalesMrp,
                ISNULL(PurtSelPrice, 0) AS SalesSelPrice,
                ISNULL(PurtRate, 0) AS SalesRate,
                ISNULL(PurGrossAmount, 0) AS SalesGrossAmount,
                ISNULL(PurtDiscountPercent, 0) AS SalesDiscountPercent,
                ISNULL(PurtDiscAmount, 0) AS SalesDiscountAmount,
                ISNULL(PurNetAmount, 0) AS SalesNetAmount,
                PurType AS SalesType,
                PurtHsnId AS SalesHsnId,
                ISNULL(TaxDescription, '') AS TaxDescription,
                (CASE TaxType WHEN 1 THEN 'Cgst' WHEN 2 THEN 'Igst' END) AS TaxDesc1,
                (CASE TaxType WHEN 1 THEN 'Sgst' WHEN 2 THEN '' END) AS TaxDesc2,
                PurtTaxRate1 AS SalesTaxRate1,
                PurtTaxRate2 AS SalesTaxRate2,
                PurtTaxAmount1 AS SalesTaxAmount1,
                PurtTaxAmount2 AS SalesTaxAmount2,
                ISNULL(CompanyPincode, '') AS CompanyPincode,
                ISNULL(csn.StateGstcode, '') AS CustomerGstStatecode,
                ISNULL(CompanyPhoneNo, '') AS CompanyPhoneNo,
                ISNULL(CompanyMobileNo, '') AS CompanyMobileNo,
                ISNULL(PurtSize, '') AS SalesSize,
                ISNULL(SizeCode, '') AS SizeCode,
                ISNULL(ProductFromSize, '') AS ProductFromSize,
                ISNULL(ProductToSize, '') AS ProductToSize,
                ISNULL(ProductMiddleSize, '') AS ProductMiddleSize,
                ISNULL((SELECT SUM(ReceiptAdjustAmount) FROM Receipt 
                        LEFT JOIN PaymentSubType ON PaymentSubtypeid = ReceiptPaymentSubTypeId 
                        LEFT JOIN PaymentType ON Paymenttypeid = PaymentSubTypePaymentId 
                        WHERE PaymentTypeName = 'Cash-In-Hand' AND ReceiptRefPurID = PurId AND ReceiptType = 1), 0) AS CashAmount,
                ISNULL((SELECT SUM(ReceiptAdjustAmount) FROM Receipt 
                        LEFT JOIN PaymentSubType ON PaymentSubtypeid = ReceiptPaymentSubTypeId 
                        LEFT JOIN PaymentType ON Paymenttypeid = PaymentSubTypePaymentId 
                        WHERE PaymentTypeName = 'UPI' AND ReceiptRefPurID = PurId AND ReceiptType = 1), 0) AS UpiAmount,
                ISNULL((SELECT SUM(ReceiptAdjustAmount) FROM Receipt 
                        LEFT JOIN PaymentSubType ON PaymentSubtypeid = ReceiptPaymentSubTypeId 
                        LEFT JOIN PaymentType ON Paymenttypeid = PaymentSubTypePaymentId 
                        WHERE PaymentTypeName = 'Card' AND ReceiptRefPurID = PurId AND ReceiptType = 1), 0) AS CardAmount,
                ISNULL((SELECT SUM(ReceiptAdjustAmount) FROM Receipt 
                        LEFT JOIN PaymentSubType ON PaymentSubtypeid = ReceiptPaymentSubTypeId 
                        LEFT JOIN PaymentType ON Paymenttypeid = PaymentSubTypePaymentId 
                        WHERE (PaymentTypeName = 'Credit Note' OR PaymentTypeName = 'CreditNote') AND ReceiptRefPurID = PurId AND ReceiptType = 1), 0) AS CNoteAmount,
                ISNULL(CompanyBillPrintMessage,'') AS CompanyBillPrintMessage,
                CAST(NULL AS VARBINARY(MAX)) AS UpiId
            FROM Purchase 
            LEFT JOIN PurchaseTrn ON PurId = PurtPurId 
            LEFT JOIN BarcodeDetails ON BarcodeId = PurtBarcodeId 
            LEFT JOIN ProductMaster ON ProductId = PurtProductId 
            LEFT JOIN Colors ON ColorId = PurtColorID 
            LEFT JOIN Brand ON BrandId = ProductBrandId 
            LEFT JOIN Customer ON CustomerId = PurCustomerId 
            LEFT JOIN City cc ON cc.CityId = CustomerCityId 
            LEFT JOIN Salesman ON SalesmanId = CASE WHEN PurtSalesmanID > 0 THEN PurtSalesmanID ELSE PurSalesmanId END
            LEFT JOIN Category ON CategoryId = ProductCtId 
            LEFT JOIN Department ON DeptId = CategoryDeptId 
            LEFT JOIN Hsn ON HsnId = PurtHsnId 
            LEFT JOIN TaxMaster ON TaxId = PurtTaxId 
            LEFT JOIN CompanyProfile ON CompanyId = PurCompanyId 
            LEFT JOIN States csn ON csn.StateId = cc.CityStateId 
            LEFT JOIN City ct ON ct.CityId = CompanyCityNo 
            LEFT JOIN States cs ON cs.StateId = CompanyStateNo 
            LEFT JOIN SizeMaster ON SizeId = ProductSizeId 
            Left join FormType on ScreenNo =PurType 
            WHERE PurId = @PurId";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.CommandTimeout = 120;
                    cmd.Parameters.AddWithValue("@PurId", purId);
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                    {
                        DataTable dt = new DataTable("SalesData");
                        da.Fill(dt);
                        return dt;
                    }
                }
            }
        }
    }
}
