using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using RMS.Core.Entities;

namespace RMS.Infrastructure.Data;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<ApplicationVersion> ApplicationVersions { get; set; }

    public virtual DbSet<Area> Areas { get; set; }

    public virtual DbSet<AuditLog> AuditLogs { get; set; }

    public virtual DbSet<AuditLogDetail> AuditLogDetails { get; set; }

    public virtual DbSet<BackupPath> BackupPaths { get; set; }

    public virtual DbSet<BarcodeDetail> BarcodeDetails { get; set; }

    public virtual DbSet<BranchMaster> BranchMasters { get; set; }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<BrandSuppMapping> BrandSuppMappings { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<ChargeMaster> ChargeMasters { get; set; }

    public virtual DbSet<City> Cities { get; set; }

    public virtual DbSet<CloudUploadLock> CloudUploadLocks { get; set; }

    public virtual DbSet<Color> Colors { get; set; }

    public virtual DbSet<CompanyProfile> CompanyProfiles { get; set; }

    public virtual DbSet<CostPrice> CostPrices { get; set; }

    public virtual DbSet<Country> Countries { get; set; }

    public virtual DbSet<Customer> Customers { get; set; }

    public virtual DbSet<CustomerGroup> CustomerGroups { get; set; }

    public virtual DbSet<CustomerOpeningBalance> CustomerOpeningBalances { get; set; }

    public virtual DbSet<CustomerOutstandingIndex> CustomerOutstandingIndexes { get; set; }

    public virtual DbSet<Department> Departments { get; set; }

    public virtual DbSet<ErrDetl> ErrDetls { get; set; }

    public virtual DbSet<ExcelColumnMapping> ExcelColumnMappings { get; set; }

    public virtual DbSet<ExcelMasterMapping> ExcelMasterMappings { get; set; }

    public virtual DbSet<ExpenseTransferLog> ExpenseTransferLogs { get; set; }

    public virtual DbSet<FormType> FormTypes { get; set; }

    public virtual DbSet<Godown> Godowns { get; set; }

    public virtual DbSet<Hsn> Hsns { get; set; }

    public virtual DbSet<HsnDetail> HsnDetails { get; set; }

    public virtual DbSet<Jobber> Jobbers { get; set; }

    public virtual DbSet<LicensingInfo> LicensingInfos { get; set; }

    public virtual DbSet<MasterUser> MasterUsers { get; set; }

    public virtual DbSet<MenuForm> MenuForms { get; set; }

    public virtual DbSet<MenuRight> MenuRights { get; set; }

    public virtual DbSet<OrderTable> OrderTables { get; set; }

    public virtual DbSet<OrderTrn> OrderTrns { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<PaymentDetail> PaymentDetails { get; set; }

    public virtual DbSet<PaymentSubType> PaymentSubTypes { get; set; }

    public virtual DbSet<PaymentType> PaymentTypes { get; set; }

    public virtual DbSet<ProductColor> ProductColors { get; set; }

    public virtual DbSet<ProductMaster> ProductMasters { get; set; }

    public virtual DbSet<Purchase> Purchases { get; set; }

    public virtual DbSet<PurchaseChargeTrn> PurchaseChargeTrns { get; set; }

    public virtual DbSet<PurchaseTrn> PurchaseTrns { get; set; }

    public virtual DbSet<QryCustomReport> QryCustomReports { get; set; }

    public virtual DbSet<Rack> Racks { get; set; }

    public virtual DbSet<Receipt> Receipts { get; set; }

    public virtual DbSet<Religion> Religions { get; set; }

    public virtual DbSet<RepCustom> RepCustoms { get; set; }

    public virtual DbSet<RepCustomTrn> RepCustomTrns { get; set; }

    public virtual DbSet<Salesman> Salesmen { get; set; }

    public virtual DbSet<SchemaVersion> SchemaVersions { get; set; }

    public virtual DbSet<ShortcutKey> ShortcutKeys { get; set; }

    public virtual DbSet<SizeDetail> SizeDetails { get; set; }

    public virtual DbSet<SizeMaster> SizeMasters { get; set; }

    public virtual DbSet<State> States { get; set; }

    public virtual DbSet<StockAudit> StockAudits { get; set; }

    public virtual DbSet<StockAuditDetail> StockAuditDetails { get; set; }

    public virtual DbSet<SubSizeMaster> SubSizeMasters { get; set; }

    public virtual DbSet<Supplier> Suppliers { get; set; }

    public virtual DbSet<SupplierBrandList> SupplierBrandLists { get; set; }

    public virtual DbSet<SupplierOpeningBalance> SupplierOpeningBalances { get; set; }

    public virtual DbSet<SyncErrorLog> SyncErrorLogs { get; set; }

    public virtual DbSet<SyncQueue> SyncQueues { get; set; }

    public virtual DbSet<SyncSetting> SyncSettings { get; set; }

    public virtual DbSet<SystemAmcDatum> SystemAmcData { get; set; }

    public virtual DbSet<TaxMaster> TaxMasters { get; set; }

    public virtual DbSet<TestTable> TestTables { get; set; }

    public virtual DbSet<Unit> Units { get; set; }

    public virtual DbSet<UserGridPreference> UserGridPreferences { get; set; }

    public virtual DbSet<UserPermission> UserPermissions { get; set; }

    public virtual DbSet<UserRight> UserRights { get; set; }

    public virtual DbSet<UserRole> UserRoles { get; set; }

    public virtual DbSet<UserRoleAssignment> UserRoleAssignments { get; set; }

    public virtual DbSet<ViewCustomerOutstanding> ViewCustomerOutstandings { get; set; }

    public virtual DbSet<ViewCustomerOutstandingBalance> ViewCustomerOutstandingBalances { get; set; }

    public virtual DbSet<WhatsAppDetail> WhatsAppDetails { get; set; }

    public virtual DbSet<WhatsAppTemplate> WhatsAppTemplates { get; set; }

    public virtual DbSet<Zone> Zones { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ApplicationVersion>(entity =>
        {
            entity.HasKey(e => e.VersionId).HasName("PK__Applicat__16C6400F4B5E98AE");

            entity.ToTable("ApplicationVersion");

            entity.Property(e => e.AppliedBy)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValueSql("(suser_sname())");
            entity.Property(e => e.UpdateDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UpdateDescription)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.UpdateType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("AUTOMATIC");
            entity.Property(e => e.VersionNumber)
                .HasMaxLength(20)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Area>(entity =>
        {
            entity.HasKey(e => e.AreaId).HasName("PK__Area__8DA7674D54B8AA6D");

            entity.ToTable("Area");

            entity.Property(e => e.AreaId).ValueGeneratedNever();
            entity.Property(e => e.AreaName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.AreaRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.AreaRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.AreaTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
            entity.Property(e => e.AreaZoneId).HasDefaultValue(0L);
        });

        modelBuilder.Entity<AuditLog>(entity =>
        {
            entity.HasKey(e => e.AuditId).HasName("PK__AuditLog__A17F2398A42216BF");

            entity.ToTable("AuditLog");

            entity.Property(e => e.ChangedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Notes).HasMaxLength(500);
            entity.Property(e => e.Operation).HasMaxLength(20);
            entity.Property(e => e.TableName).HasMaxLength(128);
        });

        modelBuilder.Entity<AuditLogDetail>(entity =>
        {
            entity.HasKey(e => e.AuditDetailId).HasName("PK__AuditLog__1E1C701D63C0AB33");

            entity.ToTable("AuditLogDetail");

            entity.Property(e => e.ColumnName).HasMaxLength(128);

            entity.HasOne(d => d.Audit).WithMany(p => p.AuditLogDetails)
                .HasForeignKey(d => d.AuditId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AuditLogD__Audit__0FF9A9DA");
        });

        modelBuilder.Entity<BackupPath>(entity =>
        {
            entity.HasKey(e => e.Key).HasName("PK__BackupPa__C41E028807E1F018");

            entity.Property(e => e.Key).HasMaxLength(50);
            entity.Property(e => e.BackupDate).HasColumnType("datetime");
            entity.Property(e => e.BackupDay)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.BackupTime).HasColumnType("datetime");
            entity.Property(e => e.LastBackupDate).HasColumnType("datetime");
            entity.Property(e => e.Path).HasMaxLength(255);
        });

        modelBuilder.Entity<BarcodeDetail>(entity =>
        {
            entity.HasNoKey();

            entity.HasIndex(e => e.BarcodeId, "IX_BarcodeDetails_Product");

            entity.Property(e => e.BarcodeBaseCost).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.BarcodeCostCode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.BarcodeCostPerQty).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.BarcodeCostWot)
                .HasColumnType("numeric(14, 4)")
                .HasColumnName("BarcodeCostWOT");
            entity.Property(e => e.BarcodeMrp).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.BarcodePerTaxValue1)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.BarcodePerTaxValue2)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.BarcodeRate).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.BarcodeRecordCreated).HasColumnType("datetime");
            entity.Property(e => e.BarcodeRecordModified).HasColumnType("datetime");
            entity.Property(e => e.BarcodeRemarks)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.BarcodeSalesmanPoints)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.BarcodeSelPrice)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.BarcodeSize)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.BarcodeSourceBarcode)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.BarcodeSubSizeId)
                .HasDefaultValue(0L)
                .HasColumnName("BarcodeSubSizeID");
            entity.Property(e => e.BarcodeTransactionDetails)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.BarcodeType)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.BarcodeValue).HasColumnType("numeric(18, 0)");
            entity.Property(e => e.BarocodeParentId).HasDefaultValue(0L);
        });

        modelBuilder.Entity<BranchMaster>(entity =>
        {
            entity.HasKey(e => e.BranchId).HasName("PK__BranchMa__A1682FC52033B847");

            entity.ToTable("BranchMaster");

            entity.Property(e => e.BranchDatabase)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.BranchLocation)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.BranchName)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.BranchServer)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Brand>(entity =>
        {
            entity.HasKey(e => e.BrandId).HasName("PK__Brand__8DA7674D54B8AA6D");

            entity.ToTable("Brand");

            entity.Property(e => e.BrandId).ValueGeneratedNever();
            entity.Property(e => e.BrandName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.BrandRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.BrandRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.BrandTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<BrandSuppMapping>(entity =>
        {
            entity.HasKey(e => e.BrandSupId).HasName("PK__BrandSup__563DCBA4A3491F9C");

            entity.ToTable("BrandSuppMapping");

            entity.HasIndex(e => new { e.BrandBrdId, e.BrandSupplierId }, "UQ_BrandSupplier").IsUnique();

            entity.Property(e => e.BrandSupId).HasColumnName("BrandSupID");
            entity.Property(e => e.BrandBrdId).HasColumnName("BrandBrdID");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Category__19093A2B0519C6AF");

            entity.ToTable("Category");

            entity.Property(e => e.CategoryId)
                .ValueGeneratedNever()
                .HasColumnName("CategoryID");
            entity.Property(e => e.CategoryCode)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.CategoryDeactive).HasDefaultValue(false);
            entity.Property(e => e.CategoryDeptId).HasDefaultValue(0L);
            entity.Property(e => e.CategoryDescription)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CategoryHsnId).HasDefaultValue(0L);
            entity.Property(e => e.CategoryLastModified).HasDefaultValue(0L);
            entity.Property(e => e.CategoryLocation).HasDefaultValue(0L);
            entity.Property(e => e.CategoryMaxPkno).HasDefaultValue(0L);
            entity.Property(e => e.CategoryRecordCreated).HasColumnType("datetime");
            entity.Property(e => e.CategoryRecordModified).HasColumnType("datetime");
            entity.Property(e => e.CategorySizeId).HasDefaultValue(0L);
            entity.Property(e => e.CategoryTimeStamp)
                .IsRowVersion()
                .IsConcurrencyToken();
            entity.Property(e => e.CategoryUserId).HasDefaultValue(0L);
        });

        modelBuilder.Entity<ChargeMaster>(entity =>
        {
            entity.HasKey(e => e.ChargeId);

            entity.ToTable("ChargeMaster");

            entity.Property(e => e.ChargeId).ValueGeneratedNever();
            entity.Property(e => e.ChargeDesc)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.ChargeIsDefault).HasDefaultValue(false);
            entity.Property(e => e.ChargeRate).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.ChargeRecordCreated).HasColumnType("datetime");
            entity.Property(e => e.ChargeRecordModified).HasColumnType("datetime");
            entity.Property(e => e.ChargeTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<City>(entity =>
        {
            entity.HasKey(e => e.CityId).HasName("PK__City__8DA7674D54B8AA6D");

            entity.ToTable("City");

            entity.Property(e => e.CityId).ValueGeneratedNever();
            entity.Property(e => e.CityName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CityRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CityRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CityTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<CloudUploadLock>(entity =>
        {
            entity.HasKey(e => e.LockId).HasName("PK__CloudUpl__E7C1E232C136312C");

            entity.ToTable("CloudUploadLock");

            entity.HasIndex(e => e.ExpiresAt, "IX_CloudUploadLock_ExpiresAt");

            entity.HasIndex(e => e.LockType, "IX_CloudUploadLock_LockType");

            entity.Property(e => e.LockId).HasMaxLength(50);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getutcdate())");
            entity.Property(e => e.LockType).HasMaxLength(50);
            entity.Property(e => e.MachineName).HasMaxLength(100);
        });

        modelBuilder.Entity<Color>(entity =>
        {
            entity.HasKey(e => e.ColorId).HasName("PK__Colors__8DA7674D54B8AA6D");

            entity.HasIndex(e => e.ColorId, "IX_Colors_ID");

            entity.Property(e => e.ColorId).ValueGeneratedNever();
            entity.Property(e => e.ColorCode)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.ColorIsDefault).HasDefaultValue(false);
            entity.Property(e => e.ColorName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.ColorRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ColorRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ColorTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<CompanyProfile>(entity =>
        {
            entity.HasKey(e => e.CompanyId).HasName("PK__CompanyP__2D971CAC1A14E395");

            entity.ToTable("CompanyProfile");

            entity.Property(e => e.BillAmount).HasDefaultValue(0L);
            entity.Property(e => e.ComapnyGstinNo)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.CompanyAddress1)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanyAddress2)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanyAddress3)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanyAllowNegativeEntry).HasDefaultValue(false);
            entity.Property(e => e.CompanyAllowNegatvieEntry).HasDefaultValue(false);
            entity.Property(e => e.CompanyAllowQtyInDecimal).HasDefaultValue(false);
            entity.Property(e => e.CompanyBarcodeType).HasDefaultValue(0);
            entity.Property(e => e.CompanyBillPrintMessage)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanyBillPrintNo).HasDefaultValue(0L);
            entity.Property(e => e.CompanyBillonCredit).HasDefaultValue(false);
            entity.Property(e => e.CompanyClientId).HasDefaultValue(0L);
            entity.Property(e => e.CompanyCostWoTax).HasDefaultValue(false);
            entity.Property(e => e.CompanyCount)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.CompanyDefaultDiscountPercent)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.CompanyDefaultRackNo).HasDefaultValue(0L);
            entity.Property(e => e.CompanyEmailId)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanyEmailPassword)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanyEnableChargeProvision).HasDefaultValue(false);
            entity.Property(e => e.CompanyEnableSsl).HasDefaultValue(false);
            entity.Property(e => e.CompanyFinFromDate).HasColumnType("datetime");
            entity.Property(e => e.CompanyFinToDate).HasColumnType("datetime");
            entity.Property(e => e.CompanyFtpDetails)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanyFtpDirectory)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanyFtpPassword)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanyFtpUserName)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanyGstCode)
                .HasMaxLength(2)
                .IsUnicode(false)
                .IsFixedLength();
            entity.Property(e => e.CompanyMobileNo)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.CompanyName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanyNegativeSourcecode)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanyOpeningStock).HasDefaultValue(false);
            entity.Property(e => e.CompanyOrderItemwise).HasDefaultValue(false);
            entity.Property(e => e.CompanyOrderPrintNo).HasDefaultValue(0L);
            entity.Property(e => e.CompanyPanNo)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanyPhoneNo)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanyPincode).HasDefaultValue(0L);
            entity.Property(e => e.CompanyPurchaseRoundOff).HasDefaultValue(false);
            entity.Property(e => e.CompanyPurchaseVerify).HasDefaultValue(false);
            entity.Property(e => e.CompanyRateRoundoff).HasDefaultValue(false);
            entity.Property(e => e.CompanyRequireSalesPerson).HasDefaultValue(false);
            entity.Property(e => e.CompanyRequireSubSize).HasDefaultValue(false);
            entity.Property(e => e.CompanySalesmanPointType).HasDefaultValue(0L);
            entity.Property(e => e.CompanySalesmanRequired).HasDefaultValue(false);
            entity.Property(e => e.CompanySalespersonCompulsory).HasDefaultValue(false);
            entity.Property(e => e.CompanyScanToSaveAndEdit).HasDefaultValue(false);
            entity.Property(e => e.CompanySendOrderWhatsapp).HasDefaultValue(false);
            entity.Property(e => e.CompanySendSalesWhatsapp).HasDefaultValue(false);
            entity.Property(e => e.CompanySendWhatsappOnOwnerNumber).HasDefaultValue(false);
            entity.Property(e => e.CompanyServiceStop).HasDefaultValue(false);
            entity.Property(e => e.CompanyShowPurchaseMatrixwise).HasDefaultValue(false);
            entity.Property(e => e.CompanyShowSelPrice).HasDefaultValue(false);
            entity.Property(e => e.CompanySmtpEmailId)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanySmtpHost)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanySmtpPort).HasDefaultValue(0);
            entity.Property(e => e.CompanySourcecodeWiseEntry).HasDefaultValue(false);
            entity.Property(e => e.CompanyStockAudit).HasDefaultValue(false);
            entity.Property(e => e.CompanyType).HasDefaultValue(0);
            entity.Property(e => e.CompanyUpiId)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanyWhatsappMobileNo)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanyWhatsappToken)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CompanyWhatsappType).HasDefaultValue(0L);
            entity.Property(e => e.CompanyWhatsappUserName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.DueDate).HasColumnType("datetime");
            entity.Property(e => e.InstallationDate).HasColumnType("datetime");
            entity.Property(e => e.IsMainCompany).HasDefaultValue(false);
            entity.Property(e => e.OsAmount).HasDefaultValue(0L);
            entity.Property(e => e.ParentLocation)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.ReceivedAmount).HasDefaultValue(0L);
            entity.Property(e => e.ServiceStop).HasDefaultValue(false);
        });

        modelBuilder.Entity<CostPrice>(entity =>
        {
            entity.ToTable("CostPrice");

            entity.Property(e => e.CostPriceA)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CostPrice_A");
            entity.Property(e => e.CostPriceB)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CostPrice_B");
            entity.Property(e => e.CostPriceC)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CostPrice_C");
            entity.Property(e => e.CostPriceD)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CostPrice_D");
            entity.Property(e => e.CostPriceE)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CostPrice_E");
            entity.Property(e => e.CostPriceF)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CostPrice_F");
            entity.Property(e => e.CostPriceG)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CostPrice_G");
            entity.Property(e => e.CostPriceH)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CostPrice_H");
            entity.Property(e => e.CostPriceI)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CostPrice_I");
            entity.Property(e => e.CostPriceJ)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("CostPrice_J");
        });

        modelBuilder.Entity<Country>(entity =>
        {
            entity.HasKey(e => e.CountryId).HasName("PK__Country__8DA7674D54B8AA6D");

            entity.ToTable("Country");

            entity.Property(e => e.CountryId).ValueGeneratedNever();
            entity.Property(e => e.CountryName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CountryRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CountryRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CountryTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.CustomerId).HasName("PK__Customer__A4AE64D8445AA113");

            entity.ToTable("Customer");

            entity.HasIndex(e => e.CustomerId, "IX_Customer_CustomerId");

            entity.HasIndex(e => e.CustomerId, "IX_Customer_ID");

            entity.Property(e => e.CustomerId).ValueGeneratedNever();
            entity.Property(e => e.CustomerAddress1)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.CustomerAddress2)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.CustomerAddress3)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.CustomerAnnDate).HasColumnType("datetime");
            entity.Property(e => e.CustomerBirthDate).HasColumnType("datetime");
            entity.Property(e => e.CustomerCgId).HasDefaultValue(0L);
            entity.Property(e => e.CustomerCode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CustomerDeActive).HasDefaultValue(false);
            entity.Property(e => e.CustomerEmailId)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("CustomerEmailID");
            entity.Property(e => e.CustomerGender).HasDefaultValue(0);
            entity.Property(e => e.CustomerGstNo)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.CustomerGstType).HasDefaultValueSql("('')");
            entity.Property(e => e.CustomerMobileNo)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.CustomerMobileNo2)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.CustomerName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CustomerNickName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CustomerPanNo)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.CustomerPincode)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(6, 0)");
            entity.Property(e => e.CustomerRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CustomerRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CustomerReligionId).HasDefaultValue(0L);
            entity.Property(e => e.CustomerRemarks)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.CustomerTimeStamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<CustomerGroup>(entity =>
        {
            entity.HasKey(e => e.CgId).HasName("PK__Customer__AC2E3F837EF6D905");

            entity.ToTable("CustomerGroup");

            entity.Property(e => e.CgId)
                .ValueGeneratedNever()
                .HasColumnName("CgID");
            entity.Property(e => e.CgCode)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.CgDeactive).HasDefaultValue(false);
            entity.Property(e => e.CgDescription)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CgLastModified).HasDefaultValue(0L);
            entity.Property(e => e.CgLocation).HasDefaultValue(0L);
            entity.Property(e => e.CgMaxPkno).HasDefaultValue(0L);
            entity.Property(e => e.CgRecordCreated).HasColumnType("datetime");
            entity.Property(e => e.CgRecordModified).HasColumnType("datetime");
            entity.Property(e => e.CgTimeStamp)
                .IsRowVersion()
                .IsConcurrencyToken();
            entity.Property(e => e.CgUserId).HasDefaultValue(0L);
        });

        modelBuilder.Entity<CustomerOpeningBalance>(entity =>
        {
            entity.HasKey(e => e.CobId);

            entity.ToTable("CustomerOpeningBalance");

            entity.Property(e => e.CobAmount).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.CobBillDate).HasColumnType("datetime");
            entity.Property(e => e.CobBillNo)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CobRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CobRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.CobRemarks)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.CobUserId).HasDefaultValue(0L);
        });

        modelBuilder.Entity<CustomerOutstandingIndex>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Customer__3214EC0758A49677");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.AppliedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.OptimizationApplied).HasDefaultValue(true);
        });

        modelBuilder.Entity<Department>(entity =>
        {
            entity.HasKey(e => e.DeptId).HasName("PK__Departme__0148818E29572725");

            entity.ToTable("Department");

            entity.Property(e => e.DeptId)
                .ValueGeneratedNever()
                .HasColumnName("DeptID");
            entity.Property(e => e.DeptCode)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.DeptDeactive).HasDefaultValue(false);
            entity.Property(e => e.DeptDescription)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.DeptLastModified).HasDefaultValue(0L);
            entity.Property(e => e.DeptLocation).HasDefaultValue(0L);
            entity.Property(e => e.DeptMaxPkno).HasDefaultValue(0L);
            entity.Property(e => e.DeptRecordCreated).HasColumnType("datetime");
            entity.Property(e => e.DeptRecordModified).HasColumnType("datetime");
            entity.Property(e => e.DeptTimeStamp)
                .IsRowVersion()
                .IsConcurrencyToken();
            entity.Property(e => e.DeptUserId).HasDefaultValue(0L);
        });

        modelBuilder.Entity<ErrDetl>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("ErrDetl");

            entity.Property(e => e.ErrAuto)
                .ValueGeneratedOnAdd()
                .HasColumnType("decimal(18, 0)");
            entity.Property(e => e.ErrBackup)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength()
                .HasColumnName("Err_Backup");
            entity.Property(e => e.ErrDate)
                .HasColumnType("datetime")
                .HasColumnName("Err_Date");
            entity.Property(e => e.ErrDesc)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("Err_Desc");
            entity.Property(e => e.ErrEvent)
                .HasMaxLength(254)
                .IsUnicode(false)
                .HasColumnName("Err_Event");
            entity.Property(e => e.ErrFrm)
                .HasMaxLength(254)
                .IsUnicode(false)
                .HasColumnName("Err_Frm");
            entity.Property(e => e.ErrModule)
                .HasMaxLength(254)
                .IsUnicode(false)
                .HasColumnName("Err_Module");
            entity.Property(e => e.ErrNum)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasColumnName("Err_Num");
        });

        modelBuilder.Entity<ExcelColumnMapping>(entity =>
        {
            entity.HasKey(e => e.MappingId).HasName("PK__ExcelCol__8B57819DCA3B4654");

            entity.ToTable("ExcelColumnMapping");

            entity.Property(e => e.MappingId).ValueGeneratedNever();
            entity.Property(e => e.ExcelColumnName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.MappingCreated).HasColumnType("datetime");
            entity.Property(e => e.MappingIsOpening).HasDefaultValue(false);
            entity.Property(e => e.MappingModified).HasColumnType("datetime");
            entity.Property(e => e.MappingType)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.SystemFieldName)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<ExcelMasterMapping>(entity =>
        {
            entity.HasKey(e => e.MappingId).HasName("PK__ExcelMas__8B57819D4E22249E");

            entity.ToTable("ExcelMasterMapping");

            entity.Property(e => e.ExcelValue)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.LastUsed).HasColumnType("datetime");
            entity.Property(e => e.MappedName)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.MasterTableName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.RecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<ExpenseTransferLog>(entity =>
        {
            entity.HasKey(e => e.TransferId).HasName("PK__ExpenseT__95490091B006B163");

            entity.ToTable("ExpenseTransferLog");

            entity.Property(e => e.Notes).HasMaxLength(500);
            entity.Property(e => e.TransferDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<FormType>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("FormType");

            entity.Property(e => e.ScreenNo).HasColumnType("numeric(14, 0)");
            entity.Property(e => e.ScreenType)
                .HasMaxLength(40)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Godown>(entity =>
        {
            entity.HasKey(e => e.GodownId).HasName("PK__Godown__8DA7674D54B8AA6D");

            entity.ToTable("Godown");

            entity.Property(e => e.GodownId).ValueGeneratedNever();
            entity.Property(e => e.GodownCode)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.GodownDesc)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.GodownRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.GodownRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.GodownTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<Hsn>(entity =>
        {
            entity.HasKey(e => e.HsnId).HasName("PK__Hsn__8DA7674D54B8AA6D");

            entity.ToTable("Hsn");

            entity.Property(e => e.HsnId).ValueGeneratedNever();
            entity.Property(e => e.HsnCode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.HsnDeactive).HasDefaultValue(false);
            entity.Property(e => e.HsnDescription)
                .HasMaxLength(200)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.HsnRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.HsnRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.HsnTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
            entity.Property(e => e.HsnWefDate).HasColumnType("datetime");
            entity.Property(e => e.HsnWefToDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<HsnDetail>(entity =>
        {
            entity.HasKey(e => e.HsdId).HasName("PK__HsnDetai__87D9E74870A8B9AE");

            entity.Property(e => e.HsdId)
                .ValueGeneratedNever()
                .HasColumnName("HsdID");
            entity.Property(e => e.HsdDeactive).HasColumnType("datetime");
            entity.Property(e => e.HsdHsnId).HasColumnName("HsdHsnID");
            entity.Property(e => e.HsdRecordCreated).HasColumnType("datetime");
            entity.Property(e => e.HsdRecordModified).HasColumnType("datetime");
            entity.Property(e => e.HsdSlabAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.HsdWefDate).HasColumnType("datetime");
        });

        modelBuilder.Entity<Jobber>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("Jobber");

            entity.HasIndex(e => e.JobberId, "IX_Jobber_ID");

            entity.Property(e => e.JobberAddress1)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.JobberAddress2)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.JobberAddress3)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.JobberCode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.JobberCreditDays).HasDefaultValue(0);
            entity.Property(e => e.JobberDeActive).HasDefaultValue(false);
            entity.Property(e => e.JobberDiscountPercent)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.JobberEmailId)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("JobberEmailID");
            entity.Property(e => e.JobberGstNo)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.JobberGstType).HasDefaultValue(0);
            entity.Property(e => e.JobberMobileNo)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.JobberMobileNo2)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.JobberName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.JobberNickName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.JobberPanNo)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.JobberPincode)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(6, 0)");
            entity.Property(e => e.JobberRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.JobberRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.JobberRemarks)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.JobberTimeStamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<LicensingInfo>(entity =>
        {
            entity.HasKey(e => e.CompanyId).HasName("PK__Licensin__2D971CACA52F1C4A");

            entity.ToTable("LicensingInfo");

            entity.Property(e => e.CompanyId).ValueGeneratedNever();
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.DueDate).HasColumnType("datetime");
            entity.Property(e => e.InstallationDate).HasColumnType("datetime");
            entity.Property(e => e.LastCloudSync).HasColumnType("datetime");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<MasterUser>(entity =>
        {
            entity.HasKey(e => e.UserId);

            entity.ToTable("Master_Users");

            entity.Property(e => e.CanShowDashboard).HasDefaultValue(false);
            entity.Property(e => e.DashboardChartType)
                .HasMaxLength(50)
                .HasDefaultValue("Line Chart");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.NoBackdateView).HasDefaultValue(false);
            entity.Property(e => e.NoDateChangeonReceipt).HasDefaultValue(false);
            entity.Property(e => e.NoDiscountAllowed).HasDefaultValue(false);
            entity.Property(e => e.NoExchangeProvision).HasDefaultValue(false);
            entity.Property(e => e.NoLastPrintOut).HasDefaultValue(false);
            entity.Property(e => e.NoProfitOnDashboard).HasDefaultValue(false);
            entity.Property(e => e.UserCreated).HasColumnType("datetime");
            entity.Property(e => e.UserModified).HasColumnType("datetime");
            entity.Property(e => e.UserName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.UserPassword)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.UserRemarks)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.UserTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<MenuForm>(entity =>
        {
            entity.HasKey(e => e.MenuId).HasName("PK__MenuForm__C99ED2308E483705");

            entity.Property(e => e.MenuId).ValueGeneratedNever();
            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.FormName).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.MenuLocation).HasDefaultValue(0L);
            entity.Property(e => e.MenuMaxPkno).HasDefaultValue(0L);
            entity.Property(e => e.MenuName).HasMaxLength(100);
            entity.Property(e => e.MenuPath).HasMaxLength(200);
            entity.Property(e => e.RecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.RecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<MenuRight>(entity =>
        {
            entity.HasKey(e => e.MenuRightId).HasName("PK__MenuRigh__A4DD47F8028CACE8");

            entity.Property(e => e.CompanyLocation).HasDefaultValue(0L);
            entity.Property(e => e.FormName).HasMaxLength(100);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.MenuName).HasMaxLength(100);
            entity.Property(e => e.MenuPath).HasMaxLength(200);
            entity.Property(e => e.RecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.RecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<OrderTable>(entity =>
        {
            entity.HasKey(e => e.OrdId).HasName("PK_Order");

            entity.ToTable("OrderTable");

            entity.Property(e => e.OrdId).ValueGeneratedNever();
            entity.Property(e => e.OrdBillDate).HasColumnType("datetime");
            entity.Property(e => e.OrdBillNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.OrdCgstAmount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.OrdChallanDate).HasColumnType("datetime");
            entity.Property(e => e.OrdChallanNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.OrdDiscountAmount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.OrdDiscountPercent).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.OrdDocDate).HasColumnType("datetime");
            entity.Property(e => e.OrdGrossAmount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.OrdIgstAmount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.OrdNetAmount)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.OrdRecordCreated).HasColumnType("datetime");
            entity.Property(e => e.OrdRecordModified).HasColumnType("datetime");
            entity.Property(e => e.OrdSgstAmount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.OrdTcsAmount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.OrdTimeStamp)
                .IsRowVersion()
                .IsConcurrencyToken();
            entity.Property(e => e.OrdTotalQty).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.OrdUgstAmount).HasColumnType("numeric(14, 4)");
        });

        modelBuilder.Entity<OrderTrn>(entity =>
        {
            entity.HasKey(e => e.OrdtId).HasName("PK_OrdtTrn");

            entity.ToTable("OrderTrn");

            entity.Property(e => e.OrdtId).ValueGeneratedNever();
            entity.Property(e => e.OrdtColorId).HasColumnName("OrdtColorID");
            entity.Property(e => e.OrdtCreditAmount).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.OrdtCreditQty).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.OrdtDebitAmount).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.OrdtDebitQty).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.OrdtDiscAmount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.OrdtDiscountPercent).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.OrdtMrp).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.OrdtPerDiscount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.OrdtPurchaseRate).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.OrdtRate)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.OrdtRecordCreated).HasColumnType("datetime");
            entity.Property(e => e.OrdtRecordModified).HasColumnType("datetime");
            entity.Property(e => e.OrdtSelPrice).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.OrdtSize)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.OrdtTaxAmount1).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.OrdtTaxAmount2).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.OrdtTaxRate1).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.OrdtTaxRate2).HasColumnType("numeric(14, 4)");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payment__9B556A384D589EEC");

            entity.ToTable("Payment");

            entity.Property(e => e.PaymentId).ValueGeneratedNever();
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PaymentDate).HasColumnType("datetime");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 2)");
        });

        modelBuilder.Entity<PaymentDetail>(entity =>
        {
            entity.HasKey(e => e.PaymentDetailId).HasName("PK__PaymentD__7F4E340F1E26B46B");

            entity.ToTable("PaymentDetail");

            entity.Property(e => e.PaymentDetailId).ValueGeneratedNever();
            entity.Property(e => e.AdjustAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.LinkedDebitNoteId).HasDefaultValue(0L);
            entity.Property(e => e.OpeningBalanceId).HasDefaultValue(0L);
            entity.Property(e => e.PaymentTypeId).HasDefaultValue(0L);
        });

        modelBuilder.Entity<PaymentSubType>(entity =>
        {
            entity.HasKey(e => e.PaymentSubTypeId).HasName("PK__PaymentSubType__8DA7674D54B8AA6D");

            entity.ToTable("PaymentSubType");

            entity.Property(e => e.PaymentSubTypeId).ValueGeneratedNever();
            entity.Property(e => e.DailyExpenses).HasDefaultValue(false);
            entity.Property(e => e.PaymentSubTypeDisplayName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.PaymentSubTypeLastModified).HasDefaultValue(0L);
            entity.Property(e => e.PaymentSubTypeName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.PaymentSubTypeOrderBy).HasDefaultValue(0L);
            entity.Property(e => e.PaymentSubTypeRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PaymentSubTypeRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PaymentSubTypeTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<PaymentType>(entity =>
        {
            entity.HasKey(e => e.PaymentTypeId).HasName("PK__PaymentType__8DA7674D54B8AA6D");

            entity.ToTable("PaymentType");

            entity.Property(e => e.PaymentTypeId).ValueGeneratedNever();
            entity.Property(e => e.PaymentTypeDefault).HasDefaultValue(false);
            entity.Property(e => e.PaymentTypeLastModified).HasDefaultValue(0L);
            entity.Property(e => e.PaymentTypeName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.PaymentTypeRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PaymentTypeRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PaymentTypeRequireSubType).HasDefaultValue(false);
            entity.Property(e => e.PaymentTypeTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
            entity.Property(e => e.PaymentisMod).HasDefaultValue(false);
        });

        modelBuilder.Entity<ProductColor>(entity =>
        {
            entity.HasKey(e => e.Pcid).HasName("PK__PC__8DA7674D54B8AA6D");

            entity.ToTable("ProductColor");

            entity.Property(e => e.Pcid)
                .ValueGeneratedNever()
                .HasColumnName("PCId");
            entity.Property(e => e.PcColorId).HasColumnName("PcColorID");
            entity.Property(e => e.PcRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PcRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PclastModified).HasColumnName("PCLastModified");
            entity.Property(e => e.Pclocation).HasColumnName("PCLocation");
            entity.Property(e => e.Pctimestamp)
                .IsRowVersion()
                .IsConcurrencyToken()
                .HasColumnName("PCTimestamp");
        });

        modelBuilder.Entity<ProductMaster>(entity =>
        {
            entity.HasKey(e => e.ProductId);

            entity.ToTable("ProductMaster");

            entity.HasIndex(e => e.ProductId, "IX_ProductMaster_ID");

            entity.Property(e => e.ProductId).ValueGeneratedNever();
            entity.Property(e => e.ProductBrandId).HasDefaultValue(0L);
            entity.Property(e => e.ProductCode)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.ProductComments)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.ProductComments2)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.ProductCtId).HasDefaultValue(0L);
            entity.Property(e => e.ProductDesc)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.ProductFromSize)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.ProductHsnId).HasDefaultValue(0L);
            entity.Property(e => e.ProductIndividualBarcode).HasDefaultValue(false);
            entity.Property(e => e.ProductLastModified).HasDefaultValue(0L);
            entity.Property(e => e.ProductLocation).HasDefaultValue(0L);
            entity.Property(e => e.ProductMarkDown).HasDefaultValue(false);
            entity.Property(e => e.ProductMarkUp).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.ProductMaxPkNo).HasDefaultValue(0L);
            entity.Property(e => e.ProductMiddleSize)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.ProductMrp)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(14, 4)");
            entity.Property(e => e.ProductMrpDiff)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(14, 4)");
            entity.Property(e => e.ProductNoStockChecking).HasDefaultValue(false);
            entity.Property(e => e.ProductRate)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(14, 4)");
            entity.Property(e => e.ProductRateDiff)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(14, 4)");
            entity.Property(e => e.ProductRecordCreated).HasColumnType("datetime");
            entity.Property(e => e.ProductRecordModified).HasColumnType("datetime");
            entity.Property(e => e.ProductSelPrice)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(14, 4)");
            entity.Property(e => e.ProductSelPriceDiscPercent).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.ProductSelPricePercent).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.ProductSizeId).HasDefaultValue(0L);
            entity.Property(e => e.ProductSupplierId).HasDefaultValue(0L);
            entity.Property(e => e.ProductTimeStamp)
                .IsRowVersion()
                .IsConcurrencyToken();
            entity.Property(e => e.ProductToSize)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.ProductUntNo).HasDefaultValue(0L);
            entity.Property(e => e.ProductUserId).HasDefaultValue(0L);
        });

        modelBuilder.Entity<Purchase>(entity =>
        {
            entity.HasKey(e => e.PurId);

            entity.ToTable("Purchase");

            entity.HasIndex(e => new { e.PurCompanyCount, e.PurCustomerId, e.PurType }, "IX_Purchase_Company_Customer_Type");

            entity.HasIndex(e => e.PurId, "IX_Purchase_Document");

            entity.HasIndex(e => e.PurCompanyCount, "IX_Purchase_PurCompanyCount");

            entity.HasIndex(e => new { e.PurCustomerId, e.PurType }, "IX_Purchase_PurCustomerId_PurType");

            entity.HasIndex(e => new { e.PurType, e.PurCompanyId, e.PurDocno, e.PurCompanyCount, e.PurLocation }, "IX_Unique_PurchaseDoc")
                .IsUnique()
                .HasFilter("([IsDeleted]=(0))");

            entity.Property(e => e.PurId).ValueGeneratedNever();
            entity.Property(e => e.PurAdvanceAmount)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurBillDate).HasColumnType("datetime");
            entity.Property(e => e.PurBillNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PurCardAmount)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurCashAmount)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurCgstAmount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurChallanDate).HasColumnType("datetime");
            entity.Property(e => e.PurChallanNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PurComments)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.PurCreditBill).HasDefaultValue(false);
            entity.Property(e => e.PurCreditNoteAmount)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurCustomerId).HasDefaultValue(0L);
            entity.Property(e => e.PurDiscountAmount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurDiscountPercent).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurDocDate).HasColumnType("datetime");
            entity.Property(e => e.PurEntryType).HasDefaultValue(0);
            entity.Property(e => e.PurExclusiveBill).HasDefaultValue(false);
            entity.Property(e => e.PurGrossAmount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurIgstAmount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurIsSynced).HasDefaultValue(false);
            entity.Property(e => e.PurNetAmount)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurOpeningStock).HasDefaultValue(false);
            entity.Property(e => e.PurReceiptAmount)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurRecordCreated).HasColumnType("datetime");
            entity.Property(e => e.PurRecordModified).HasColumnType("datetime");
            entity.Property(e => e.PurRoundoff)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurSalesmanId).HasDefaultValue(0L);
            entity.Property(e => e.PurSgstAmount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurStockAudit).HasDefaultValue(false);
            entity.Property(e => e.PurTcsAmount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurTimeStamp)
                .IsRowVersion()
                .IsConcurrencyToken();
            entity.Property(e => e.PurTotalQty).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurUgstAmount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurUpiAmount)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurVerify).HasDefaultValue(false);
            entity.Property(e => e.PurStatus)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("Draft");
        });

        modelBuilder.Entity<PurchaseChargeTrn>(entity =>
        {
            entity.HasKey(e => e.PurcId);

            entity.ToTable("PurchaseChargeTrn");

            entity.Property(e => e.PurcId).ValueGeneratedNever();
            entity.Property(e => e.PurcAmount).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurcChargeRate).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurcRecordCreated).HasColumnType("datetime");
            entity.Property(e => e.PurcRecordModified).HasColumnType("datetime");
            entity.Property(e => e.PurcReverseTaxAmount1).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurcReverseTaxAmount2).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurcTaxAmount1)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurcTaxAmount2)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurcTaxId).HasDefaultValue(0L);
            entity.Property(e => e.PurcTaxRate1)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurcTaxRate2)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
        });

        modelBuilder.Entity<PurchaseTrn>(entity =>
        {
            entity.HasKey(e => e.PurtId);

            entity.ToTable("PurchaseTrn");

            entity.HasIndex(e => new { e.PurtAlteration, e.PurtDelivered, e.PurtReceived, e.PurtJobberId, e.PurtPurId }, "IX_PurchaseTrn_Alteration");

            entity.Property(e => e.PurtId).ValueGeneratedNever();
            entity.Property(e => e.PurtAlteration).HasDefaultValue(false);
            entity.Property(e => e.PurtAlterationImage)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.PurtColorId).HasColumnName("PurtColorID");
            entity.Property(e => e.PurtCommissionRate)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtCostRate).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtCreditAmount).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtCreditQty).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurtDebitAmount).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtDebitQty).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurtDelivered).HasDefaultValue(false);
            entity.Property(e => e.PurtDeliveredDate).HasColumnType("datetime");
            entity.Property(e => e.PurtDeliveryDate).HasColumnType("datetime");
            entity.Property(e => e.PurtDetailSdocno)
                .HasDefaultValue(0)
                .HasColumnName("PurtDetailSDocno");
            entity.Property(e => e.PurtDiscAmount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurtDiscountPercent).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurtJobberId)
                .HasDefaultValue(0L)
                .HasColumnName("PurtJobberID");
            entity.Property(e => e.PurtMarkDownPercent).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtMiddleMrp).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtMiddleRate)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtMiddleSelPrice).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtMrp).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurtMrpDiff).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtOrdtId).HasDefaultValue(0L);
            entity.Property(e => e.PurtPerDiscount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurtPerQty).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtPurchaseRate).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurtRackNo).HasDefaultValue(0L);
            entity.Property(e => e.PurtRate)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtRateDiff).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtReceived).HasDefaultValue(false);
            entity.Property(e => e.PurtReceivedDate).HasColumnType("datetime");
            entity.Property(e => e.PurtRecordCreated).HasColumnType("datetime");
            entity.Property(e => e.PurtRecordModified).HasColumnType("datetime");
            entity.Property(e => e.PurtRemarks)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.PurtReverseTaxAmount1).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtReverseTaxAmount2).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtSalesmanId).HasDefaultValue(0L);
            entity.Property(e => e.PurtSalesmanPoints)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtSelPrice).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurtSelPriceDiscPercent).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtSize)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.PurtSizeFrom)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.PurtSizeMiddle)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.PurtSizeTo)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.PurtSourcecode).HasMaxLength(50);
            entity.Property(e => e.PurtSubSizeId)
                .HasDefaultValue(0L)
                .HasColumnName("PurtSubSizeID");
            entity.Property(e => e.PurtTaxAmount1).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtTaxAmount2).HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtTaxRate1).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurtTaxRate2).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.PurtTotalSalesmanpoint)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.PurtWhatsappSent).HasDefaultValue(false);
            entity.Property(e => e.PurtWhatsappSentonReceived).HasDefaultValue(false);
        });

        modelBuilder.Entity<QryCustomReport>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("Qry_CustomReport");

            entity.Property(e => e.RctDesc)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Rct_Desc");
            entity.Property(e => e.RctFileName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Rct_FileName");
            entity.Property(e => e.RctInactive)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("Rct_Inactive");
            entity.Property(e => e.RctNo)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("Rct_No");
            entity.Property(e => e.RctOrder).HasColumnName("Rct_Order");
            entity.Property(e => e.RctRepNo)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("Rct_RepNo");
            entity.Property(e => e.RctReportType)
                .HasColumnType("numeric(6, 0)")
                .HasColumnName("Rct_ReportType");
            entity.Property(e => e.RctUserOrder)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("Rct_UserOrder");
            entity.Property(e => e.RepCompletePathname)
                .HasMaxLength(201)
                .IsUnicode(false)
                .HasColumnName("Rep_CompletePathname");
            entity.Property(e => e.RepDesc)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Rep_Desc");
            entity.Property(e => e.RepNo)
                .HasColumnType("numeric(14, 0)")
                .HasColumnName("Rep_No");
            entity.Property(e => e.RepOrderBy)
                .HasColumnType("numeric(6, 0)")
                .HasColumnName("Rep_OrderBy");
            entity.Property(e => e.RepPathName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Rep_PathName");
            entity.Property(e => e.RepTtxName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("Rep_TtxName");
        });

        modelBuilder.Entity<Rack>(entity =>
        {
            entity.HasKey(e => e.RackId).HasName("PK__Rack__8DA7674D54B8AA6D");

            entity.ToTable("Rack");

            entity.Property(e => e.RackId).ValueGeneratedNever();
            entity.Property(e => e.RackCode)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.RackDesc)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.RackRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.RackRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.RackTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<Receipt>(entity =>
        {
            entity.HasKey(e => e.ReceiptId).HasName("PK_Receiptchase");

            entity.ToTable("Receipt");

            entity.HasIndex(e => new { e.ReceiptRefPurId, e.ReceiptType }, "IX_Receipt_ReceiptRefPurID");

            entity.HasIndex(e => new { e.ReceiptReturnId, e.ReceiptType }, "IX_Receipt_ReceiptReturnId");

            entity.Property(e => e.ReceiptId).ValueGeneratedNever();
            entity.Property(e => e.ReceiptAdjustAmount)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(14, 4)");
            entity.Property(e => e.ReceiptAdjustDate).HasColumnType("datetime");
            entity.Property(e => e.ReceiptAdvanceId).HasDefaultValue(0L);
            entity.Property(e => e.ReceiptAmount).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.ReceiptDirection).HasDefaultValue((byte)1);
            entity.Property(e => e.ReceiptDocDate).HasColumnType("datetime");
            entity.Property(e => e.ReceiptIsAdvance).HasDefaultValue(false);
            entity.Property(e => e.ReceiptLedgerId).HasDefaultValue(0L);
            entity.Property(e => e.ReceiptNotes).HasMaxLength(500);
            entity.Property(e => e.ReceiptRecordCreated).HasColumnType("datetime");
            entity.Property(e => e.ReceiptRecordModified).HasColumnType("datetime");
            entity.Property(e => e.ReceiptRefPurId).HasColumnName("ReceiptRefPurID");
            entity.Property(e => e.ReceiptReturnId).HasDefaultValue(0L);
            entity.Property(e => e.ReceiptTimeStamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<Religion>(entity =>
        {
            entity.HasKey(e => e.ReligionId).HasName("PK__Religion__8DA7674D54B8AA6D");

            entity.ToTable("Religion");

            entity.Property(e => e.ReligionId).ValueGeneratedNever();
            entity.Property(e => e.ReligionName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.ReligionRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ReligionRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ReligionTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<RepCustom>(entity =>
        {
            entity.HasKey(e => e.RepNo);

            entity.ToTable("Rep_Custom");

            entity.Property(e => e.RepNo)
                .HasColumnType("numeric(14, 0)")
                .HasColumnName("Rep_No");
            entity.Property(e => e.RepDesc)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("")
                .HasColumnName("Rep_Desc");
            entity.Property(e => e.RepOrderBy)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(6, 0)")
                .HasColumnName("Rep_OrderBy");
            entity.Property(e => e.RepPathName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("")
                .HasColumnName("Rep_PathName");
            entity.Property(e => e.RepTtxName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("")
                .HasColumnName("Rep_TtxName");
        });

        modelBuilder.Entity<RepCustomTrn>(entity =>
        {
            entity.HasKey(e => e.RctNo);

            entity.ToTable("Rep_CustomTrn");

            entity.Property(e => e.RctNo)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("Rct_No");
            entity.Property(e => e.RctDesc)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("")
                .HasColumnName("Rct_Desc");
            entity.Property(e => e.RctFileName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("")
                .HasColumnName("Rct_FileName");
            entity.Property(e => e.RctInactive)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("N")
                .HasColumnName("Rct_Inactive");
            entity.Property(e => e.RctOrder)
                .HasDefaultValue(0)
                .HasColumnName("Rct_Order");
            entity.Property(e => e.RctRepNo)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(18, 0)")
                .HasColumnName("Rct_RepNo");
            entity.Property(e => e.RctReportType)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(6, 0)")
                .HasColumnName("Rct_ReportType");
            entity.Property(e => e.RctUserOrder)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValue("")
                .HasColumnName("Rct_UserOrder");
        });

        modelBuilder.Entity<Salesman>(entity =>
        {
            entity.HasKey(e => e.SalesmanId).HasName("PK__Salesman__A4AE64D8445AA113");

            entity.ToTable("Salesman");

            entity.HasIndex(e => e.SalesmanId, "IX_Salesman_ID");

            entity.Property(e => e.SalesmanId).ValueGeneratedNever();
            entity.Property(e => e.SalesmanAddress1)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.SalesmanAddress2)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.SalesmanAddress3)
                .HasMaxLength(60)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.SalesmanAreaId).HasDefaultValue(0L);
            entity.Property(e => e.SalesmanBirthDate).HasColumnType("datetime");
            entity.Property(e => e.SalesmanCityId).HasDefaultValue(0L);
            entity.Property(e => e.SalesmanCode)
                .HasMaxLength(50)
                .HasDefaultValue("");
            entity.Property(e => e.SalesmanCommission)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(14, 4)");
            entity.Property(e => e.SalesmanDeActive).HasDefaultValue(false);
            entity.Property(e => e.SalesmanDoj)
                .HasColumnType("datetime")
                .HasColumnName("SalesmanDOJ");
            entity.Property(e => e.SalesmanEmailId)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasDefaultValue("")
                .HasColumnName("SalesmanEmailID");
            entity.Property(e => e.SalesmanMobileNo)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.SalesmanMobileNo2)
                .HasMaxLength(12)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.SalesmanName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.SalesmanNickName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.SalesmanPanNo)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.SalesmanRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SalesmanRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SalesmanRemarks)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.SalesmanTimeStamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<SchemaVersion>(entity =>
        {
            entity.HasKey(e => e.ChangeId).HasName("PK__SchemaVe__0E05C59702084FDA");

            entity.ToTable("SchemaVersion");

            entity.Property(e => e.AppliedBy)
                .HasMaxLength(100)
                .HasDefaultValueSql("(suser_sname())");
            entity.Property(e => e.AppliedDate).HasColumnType("datetime");
            entity.Property(e => e.ChangeDataType).HasMaxLength(100);
            entity.Property(e => e.ChangeDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ChangeDescription).HasMaxLength(1000);
            entity.Property(e => e.ChangeType).HasMaxLength(50);
            entity.Property(e => e.ObjectName).HasMaxLength(255);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("PENDING");
            entity.Property(e => e.VersionNumber)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("1.0.0");
        });

        modelBuilder.Entity<ShortcutKey>(entity =>
        {
            entity.HasKey(e => e.ShortcutId).HasName("PK__Shortcut__CBB1CC3B5CD4725B");

            entity.Property(e => e.KeyChar)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.ShortcutName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ShortcutType)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<SizeDetail>(entity =>
        {
            entity.HasKey(e => e.SzdId).HasName("PK__SizeDeta__FE55F0131E6F845E");

            entity.Property(e => e.SzdId)
                .ValueGeneratedNever()
                .HasColumnName("SzdID");
            entity.Property(e => e.SzdAddtionalDetail)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.SzdDeactive).HasDefaultValue(false);
            entity.Property(e => e.SzdOrderBy).HasDefaultValue(0L);
            entity.Property(e => e.SzdRecordCreated).HasColumnType("datetime");
            entity.Property(e => e.SzdRecordModified).HasColumnType("datetime");
            entity.Property(e => e.SzdSize)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.SzdSizeId).HasColumnName("SzdSizeID");
        });

        modelBuilder.Entity<SizeMaster>(entity =>
        {
            entity.HasKey(e => e.SizeId).HasName("PK__Size__8DA7674D54B8AA6D");

            entity.ToTable("SizeMaster");

            entity.Property(e => e.SizeId).ValueGeneratedNever();
            entity.Property(e => e.SizeCode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.SizeDeactive).HasDefaultValue(false);
            entity.Property(e => e.SizeDescription)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.SizeRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SizeRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SizeTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<State>(entity =>
        {
            entity.HasKey(e => e.StateId).HasName("PK__State__8DA7674D54B8AA6D");

            entity.Property(e => e.StateId).ValueGeneratedNever();
            entity.Property(e => e.StateGstCode)
                .HasMaxLength(5)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.StateName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.StateRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.StateRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.StateTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
            entity.Property(e => e.StateUt)
                .HasDefaultValue(false)
                .HasColumnName("StateUT");
        });

        modelBuilder.Entity<StockAudit>(entity =>
        {
            entity.HasKey(e => e.AuditId).HasName("PK__StockAud__A17F23981C1C285E");

            entity.ToTable("StockAudit");

            entity.Property(e => e.AuditId).ValueGeneratedNever();
            entity.Property(e => e.AuditCreatedDate).HasColumnType("datetime");
            entity.Property(e => e.AuditDocDate).HasColumnType("datetime");
            entity.Property(e => e.AuditIsSynced).HasDefaultValue(false);
        });

        modelBuilder.Entity<StockAuditDetail>(entity =>
        {
            entity.HasKey(e => e.AuditDetailId).HasName("PK__StockAud__1E1C701D7AAB647E");

            entity.ToTable("StockAuditDetail");

            entity.Property(e => e.AuditDetailId).ValueGeneratedNever();
            entity.Property(e => e.AuditDetailBarcodeId)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.AuditDetailColor)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.AuditDetailDifference).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.AuditDetailProductName)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.AuditDetailScannedQty).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.AuditDetailSize)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.AuditDetailSystemQty).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.AuditDetailAudit).WithMany(p => p.StockAuditDetails)
                .HasForeignKey(d => d.AuditDetailAuditId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__StockAudi__Audit__4729E333");
        });

        modelBuilder.Entity<SubSizeMaster>(entity =>
        {
            entity.HasKey(e => e.SubSizeId).HasName("PK__SubSizes__8DA7674D54B8AA6D");

            entity.ToTable("SubSizeMaster");

            entity.Property(e => e.SubSizeId).ValueGeneratedNever();
            entity.Property(e => e.SubSizeCode)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.SubSizeIsDefault).HasDefaultValue(false);
            entity.Property(e => e.SubSizeName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.SubSizeRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SubSizeRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SubSizeTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(e => e.SupplierId).HasName("PK__Supplier__A4AE64D8445AA113");

            entity.ToTable("Supplier");

            entity.Property(e => e.SupplierId).ValueGeneratedNever();
            entity.Property(e => e.SupplierAddress1)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.SupplierAddress2)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.SupplierAddress3)
                .HasMaxLength(60)
                .IsUnicode(false);
            entity.Property(e => e.SupplierCode)
                .HasMaxLength(20)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.SupplierCreditDays).HasDefaultValue(0);
            entity.Property(e => e.SupplierDeActive).HasDefaultValue(false);
            entity.Property(e => e.SupplierDiscountPercent)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(14, 4)");
            entity.Property(e => e.SupplierEmailId)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("SupplierEmailID");
            entity.Property(e => e.SupplierGstNo)
                .HasMaxLength(15)
                .IsUnicode(false);
            entity.Property(e => e.SupplierGstType).HasDefaultValue(0);
            entity.Property(e => e.SupplierMobileNo)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.SupplierMobileNo2)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.SupplierName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.SupplierNickName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.SupplierPanNo)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.SupplierPincode)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(6, 0)");
            entity.Property(e => e.SupplierRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SupplierRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SupplierRemarks)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.SupplierTimeStamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<SupplierBrandList>(entity =>
        {
            entity.HasKey(e => e.SupBrId);

            entity.ToTable("SupplierBrandList");

            entity.Property(e => e.SupBrId).ValueGeneratedNever();
            entity.Property(e => e.RecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.RecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TimeStamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<SupplierOpeningBalance>(entity =>
        {
            entity.HasKey(e => e.Sobid).HasName("PK__Supplier__B439BD8B2A4791D1");

            entity.ToTable("SupplierOpeningBalance");

            entity.HasIndex(e => new { e.CompanyId, e.OpeningDate }, "IX_SOB_CompanyId_Date");

            entity.HasIndex(e => e.SupplierId, "IX_SOB_SupplierId");

            entity.Property(e => e.Sobid).HasColumnName("SOBId");
            entity.Property(e => e.AdjustedAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.BillAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedOn)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsCredit).HasDefaultValue(true);
            entity.Property(e => e.ModifiedOn).HasColumnType("datetime");
            entity.Property(e => e.OpeningDate).HasColumnType("datetime");
            entity.Property(e => e.OpeningType).HasDefaultValue((byte)1);
            entity.Property(e => e.ReferenceNo)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Remarks)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.SupplierBillDate).HasColumnType("datetime");
            entity.Property(e => e.SupplierBillNo)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.SupplierDocDate).HasColumnType("datetime");
            entity.Property(e => e.SupplierDocNo)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<SyncErrorLog>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__SyncErro__5E548648F8E5D24C");

            entity.ToTable("SyncErrorLog");

            entity.Property(e => e.ErrorMessage).IsUnicode(false);
            entity.Property(e => e.LogDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TableName)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<SyncQueue>(entity =>
        {
            entity.HasKey(e => e.SyncId).HasName("PK__SyncQueu__7E50DEC6C9BE4460");

            entity.ToTable("SyncQueue");

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.IsSynced).HasDefaultValue(false);
            entity.Property(e => e.RetryCount).HasDefaultValue(0);
            entity.Property(e => e.SyncType)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.TableName)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<SyncSetting>(entity =>
        {
            entity.HasKey(e => e.SyncId).HasName("PK__SyncSett__7E50DEC6D25D0814");

            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.LastSyncAt).HasColumnType("datetime");
            entity.Property(e => e.SyncIntervalMinutes).HasDefaultValue(60);
            entity.Property(e => e.TableName)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<SystemAmcDatum>(entity =>
        {
            entity.HasKey(e => e.ConfigKey).HasName("PK__SystemAm__4A306785F4831981");

            entity.Property(e => e.ConfigKey).HasMaxLength(50);
            entity.Property(e => e.ConfigValue).HasMaxLength(500);
        });

        modelBuilder.Entity<TaxMaster>(entity =>
        {
            entity.HasKey(e => e.TaxId).HasName("PK__TaxMaste__711BE08C208CD6FA");

            entity.ToTable("TaxMaster");

            entity.Property(e => e.TaxId)
                .ValueGeneratedNever()
                .HasColumnName("TaxID");
            entity.Property(e => e.TaxCgst)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(14, 4)");
            entity.Property(e => e.TaxDeactive).HasDefaultValue(false);
            entity.Property(e => e.TaxDescription)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TaxIgst)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(14, 4)");
            entity.Property(e => e.TaxLastModified).HasDefaultValue(0L);
            entity.Property(e => e.TaxLocation).HasDefaultValue(0L);
            entity.Property(e => e.TaxMaxPkno).HasDefaultValue(0L);
            entity.Property(e => e.TaxRate)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(14, 4)");
            entity.Property(e => e.TaxRecordCreated).HasColumnType("datetime");
            entity.Property(e => e.TaxRecordModified).HasColumnType("datetime");
            entity.Property(e => e.TaxSgst).HasColumnType("numeric(14, 4)");
            entity.Property(e => e.TaxTimeStamp)
                .IsRowVersion()
                .IsConcurrencyToken();
            entity.Property(e => e.TaxType).HasDefaultValue(0);
            entity.Property(e => e.TaxUgst)
                .HasDefaultValue(0m)
                .HasColumnType("numeric(14, 4)");
            entity.Property(e => e.TaxUserId).HasDefaultValue(0L);
        });

        modelBuilder.Entity<TestTable>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TestTabl__3214EC07F03F5755");

            entity.ToTable("TestTable");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Unit>(entity =>
        {
            entity.HasKey(e => e.UnitId).HasName("PK__Unit__8DA7674D54B8AA6D");

            entity.ToTable("Unit");

            entity.Property(e => e.UnitId).ValueGeneratedNever();
            entity.Property(e => e.UnitCode)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.UnitDescGst)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.UnitName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.UnitRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UnitRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UnitTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        modelBuilder.Entity<UserGridPreference>(entity =>
        {
            entity.HasKey(e => e.PreferenceId);

            entity.HasIndex(e => new { e.UserId, e.FormName, e.GridName }, "IX_UserGridPreferences_UserForm");

            entity.HasIndex(e => new { e.UserId, e.FormName, e.GridName, e.ColumnName }, "UQ_UserGridPreferences").IsUnique();

            entity.Property(e => e.PreferenceId).HasColumnName("PreferenceID");
            entity.Property(e => e.ColumnName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.ColumnWidth).HasDefaultValue(100);
            entity.Property(e => e.CreatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FormName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.GridName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.IsVisible).HasDefaultValue(true);
            entity.Property(e => e.ModifiedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");
        });

        modelBuilder.Entity<UserPermission>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__UserPerm__3214EC0754AD302C");

            entity.Property(e => e.CanCreateNew).HasDefaultValue(false);
            entity.Property(e => e.CanDisplay).HasDefaultValue(false);
            entity.Property(e => e.CanEdit).HasDefaultValue(false);
            entity.Property(e => e.CanPrint).HasDefaultValue(false);
            entity.Property(e => e.FormName).HasMaxLength(100);
        });

        modelBuilder.Entity<UserRight>(entity =>
        {
            entity.HasKey(e => e.UserRightId).HasName("PK__UserRigh__956097A2444861BA");

            entity.Property(e => e.CanAdd).HasDefaultValue(false);
            entity.Property(e => e.CanChangeDateonSales).HasDefaultValue(false);
            entity.Property(e => e.CanChangePaymentMode).HasDefaultValue(false);
            entity.Property(e => e.CanDelete).HasDefaultValue(false);
            entity.Property(e => e.CanEdit).HasDefaultValue(false);
            entity.Property(e => e.CanPreview).HasDefaultValue(false);
            entity.Property(e => e.CanPrint).HasDefaultValue(false);
            entity.Property(e => e.CanView).HasDefaultValue(false);
            entity.Property(e => e.CompanyLocation).HasDefaultValue(0L);
            entity.Property(e => e.RecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.RecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__UserRole__8AFACE1A3C5532A2");

            entity.Property(e => e.CompanyLocation).HasDefaultValue(0L);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.RecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.RecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.RoleDescription).HasMaxLength(500);
            entity.Property(e => e.RoleName).HasMaxLength(100);
        });

        modelBuilder.Entity<UserRoleAssignment>(entity =>
        {
            entity.HasKey(e => e.AssignmentId).HasName("PK__UserRole__32499E77DB86F524");

            entity.Property(e => e.CompanyLocation).HasDefaultValue(0L);
            entity.Property(e => e.RecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.RecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Role).WithMany(p => p.UserRoleAssignments)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserRoleAssignments_RoleId");

            entity.HasOne(d => d.User).WithMany(p => p.UserRoleAssignments)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_UserRoleAssignments_UserId");
        });

        modelBuilder.Entity<ViewCustomerOutstanding>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("ViewCustomerOutstanding");

            entity.Property(e => e.CustomerName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.OutstandingAmount).HasColumnType("numeric(38, 4)");
            entity.Property(e => e.PurDocdate).HasColumnType("datetime");
        });

        modelBuilder.Entity<ViewCustomerOutstandingBalance>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("ViewCustomerOutstandingBalance");

            entity.Property(e => e.CustomerName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.OutstandingAmount).HasColumnType("decimal(19, 4)");
            entity.Property(e => e.PurDocdate).HasColumnType("datetime");
        });

        modelBuilder.Entity<WhatsAppDetail>(entity =>
        {
            entity.HasKey(e => e.WhatsappId);

            entity.Property(e => e.WhatsappDate).HasColumnType("datetime");
            entity.Property(e => e.WhatsappMessage)
                .HasMaxLength(400)
                .IsUnicode(false);
            entity.Property(e => e.WhatsappMobileno)
                .HasMaxLength(12)
                .IsUnicode(false);
            entity.Property(e => e.WhatsappRemarks)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.WhatsappTemplateId).HasDefaultValue(0L);
            entity.Property(e => e.WhatsappUrl)
                .HasMaxLength(500)
                .IsUnicode(false);
        });

        modelBuilder.Entity<WhatsAppTemplate>(entity =>
        {
            entity.HasKey(e => e.TemplateId).HasName("PK__WhatsApp__F87ADD2722F639EC");

            entity.Property(e => e.TemplateId).ValueGeneratedNever();
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.TemplateName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.TemplateRecordCreated)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TemplateRecordModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TemplateType)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Zone>(entity =>
        {
            entity.HasKey(e => e.ZoneId).HasName("PK__Zone__8DA7674D54B8AA6D");

            entity.Property(e => e.ZoneId).ValueGeneratedNever();
            entity.Property(e => e.ZoneName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasDefaultValue("");
            entity.Property(e => e.ZoneRecordCreated).HasColumnType("datetime");
            entity.Property(e => e.ZoneRecordModified).HasColumnType("datetime");
            entity.Property(e => e.ZoneTimestamp)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
