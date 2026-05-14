using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RMS.Core.Entities;

namespace RMS.Application.Interfaces;

public interface IApplicationDbContext
{
    DbSet<MasterUser> MasterUsers { get; set; }
    // Add other DbSets as needed for the application layer
    DbSet<Customer> Customers { get; set; } 
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
