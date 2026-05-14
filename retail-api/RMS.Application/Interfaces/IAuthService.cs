using System.Threading.Tasks;
using RMS.Application.DTOs;

namespace RMS.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(AuthRequest request);
}
