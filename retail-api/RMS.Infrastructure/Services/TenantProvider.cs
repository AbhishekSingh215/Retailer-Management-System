using System;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using RMS.Application.Interfaces;
using RMS.Infrastructure.Data;

namespace RMS.Infrastructure.Services;

public class TenantProvider : ITenantProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IServiceProvider _serviceProvider;
    private readonly IMemoryCache _cache;
    private readonly IEncryptionService _encryptionService;
    private readonly string _fallbackConnectionString;
    private string? _tenantOverride;

    public TenantProvider(
        IHttpContextAccessor httpContextAccessor,
        IServiceProvider serviceProvider,
        IMemoryCache cache,
        IEncryptionService encryptionService,
        IConfiguration configuration)
    {
        _httpContextAccessor = httpContextAccessor;
        _serviceProvider = serviceProvider;
        _cache = cache;
        _encryptionService = encryptionService;
        
        _fallbackConnectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? "Server=STATICABHI;Database=Parichay;Trusted_Connection=True;TrustServerCertificate=True";
    }

    public void SetTenantOverride(string clientId)
    {
        _tenantOverride = clientId;
    }

    public string GetConnectionString()
    {
        if (!string.IsNullOrEmpty(_tenantOverride))
        {
            return ResolveConnectionStringForClient(_tenantOverride);
        }

        var user = _httpContextAccessor.HttpContext?.User;
        var clientIdClaim = user?.FindFirst("client_id")?.Value;

        if (!string.IsNullOrEmpty(clientIdClaim))
        {
            return ResolveConnectionStringForClient(clientIdClaim);
        }

        return _fallbackConnectionString;
    }

    private string ResolveConnectionStringForClient(string clientId)
    {
        var cacheKey = $"Tenant_ConnStr_{clientId}";

        return _cache.GetOrCreate(cacheKey, entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15);
            entry.SlidingExpiration = TimeSpan.FromMinutes(5);

            using var scope = _serviceProvider.CreateScope();
            var masterDb = scope.ServiceProvider.GetRequiredService<MasterDbContext>();

            var clientConnection = masterDb.ClientConnections
                .FirstOrDefault(c => c.ClientId == clientId && c.IsActive);

            if (clientConnection == null)
            {
                throw new Exception($"Active client connection mapping not found for ClientId: {clientId}");
            }

            var decryptedConnStr = _encryptionService.Decrypt(clientConnection.ConnectionString);
            
            // Extract the database name from connection string for logging
            var dbName = "Unknown";
            var parts = decryptedConnStr.Split(';');
            foreach (var part in parts)
            {
                if (part.Trim().StartsWith("Database", StringComparison.OrdinalIgnoreCase) || 
                    part.Trim().StartsWith("Initial Catalog", StringComparison.OrdinalIgnoreCase))
                {
                    dbName = part.Split('=').LastOrDefault()?.Trim() ?? "Unknown";
                    break;
                }
            }

            Console.WriteLine($"[Multi-Tenant] 🔀 Routed request for Client '{clientId}' to Database: '{dbName}'");
            
            return decryptedConnStr;
        }) ?? _fallbackConnectionString;
    }
}
