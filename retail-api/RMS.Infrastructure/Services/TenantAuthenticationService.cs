using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RMS.Application.Interfaces;
using RMS.Infrastructure.Data;

namespace RMS.Infrastructure.Services;

public class TenantAuthenticationService : ITenantAuthenticationService
{
    private readonly MasterDbContext _masterContext;

    public TenantAuthenticationService(MasterDbContext masterContext)
    {
        _masterContext = masterContext;
    }

    public async Task<TenantInfo?> GetTenantByUserIdAsync(string userId)
    {
        var client = await _masterContext.ClientConnections
            .FirstOrDefaultAsync(c => c.UserId == userId && c.IsActive);

        if (client == null) return null;

        return new TenantInfo
        {
            ClientId = client.ClientId,
            ConnectionString = client.ConnectionString,
            UserPassword = client.UserPassword
        };
    }
}
