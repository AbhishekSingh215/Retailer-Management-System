namespace RMS.Application.Interfaces;

public interface ITenantProvider
{
    string GetConnectionString();
    void SetTenantOverride(string clientId);
}
