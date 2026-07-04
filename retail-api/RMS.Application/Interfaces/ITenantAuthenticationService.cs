using System.Threading.Tasks;

namespace RMS.Application.Interfaces;

public class TenantInfo
{
    public string ClientId { get; set; } = string.Empty;
    public string ConnectionString { get; set; } = string.Empty;
    public string UserPassword { get; set; } = string.Empty;
}

public interface ITenantAuthenticationService
{
    Task<TenantInfo?> GetTenantByUserIdAsync(string userId);
}
