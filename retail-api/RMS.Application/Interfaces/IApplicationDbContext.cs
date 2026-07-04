using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RMS.Core.Entities;

namespace RMS.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<MasterUser> MasterUsers { get; set; }
    DbSet<CompanyProfile> CompanyProfiles { get; set; }
    DbSet<Purchase> Purchases { get; set; }
    DbSet<PurchaseTrn> PurchaseTrns { get; set; }
    DbSet<Customer> Customers { get; set; } 
    DbSet<BarcodeDetail> BarcodeDetails { get; set; }
    DbSet<ProductMaster> ProductMasters { get; set; }
    DbSet<Category> Categories { get; set; }
    DbSet<Color> Colors { get; set; }
    DbSet<Hsn> Hsns { get; set; }
    DbSet<HsnDetail> HsnDetails { get; set; }
    DbSet<TaxMaster> TaxMasters { get; set; }
    DbSet<Salesman> Salesmen { get; set; }
    DbSet<PaymentType> PaymentTypes { get; set; }
    DbSet<City> Cities { get; set; }
    DbSet<State> States { get; set; }
    DbSet<Country> Countries { get; set; }
    DbSet<Receipt> Receipts { get; set; }
    DbSet<PaymentSubType> PaymentSubTypes { get; set; }
    DbSet<RepCustom> RepCustoms { get; set; }
    DbSet<RepCustomTrn> RepCustomTrns { get; set; }
    long GetMaxPknolocation(string TableName, string Location, string ColumnName, string LocationColumn, string maxPknocolumn);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}

