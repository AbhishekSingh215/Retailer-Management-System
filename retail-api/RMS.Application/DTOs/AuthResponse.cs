namespace RMS.Application.DTOs;

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public long UserId { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
