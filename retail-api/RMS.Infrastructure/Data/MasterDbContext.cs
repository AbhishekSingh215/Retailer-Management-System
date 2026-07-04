using Microsoft.EntityFrameworkCore;
using RMS.Core.Entities;

namespace RMS.Infrastructure.Data;

public class MasterDbContext : DbContext
{
    public MasterDbContext(DbContextOptions<MasterDbContext> options)
        : base(options)
    {
    }

    public DbSet<ClientConnection> ClientConnections { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ClientConnection>(entity =>
        {
            entity.HasKey(e => e.UserId);
            entity.Property(e => e.UserId).HasMaxLength(100);
            entity.Property(e => e.ClientId).HasMaxLength(50).IsRequired();
            entity.Property(e => e.UserPassword).HasMaxLength(200).IsRequired();
            entity.Property(e => e.ConnectionString).IsRequired();
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");
        });
    }
}
