namespace RMS.Application.DTOs;

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public long UserId { get; set; }
    public long CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string CompanyCount { get; set; } = string.Empty;
    public System.DateTime? FinFromDate { get; set; }
    public System.DateTime? FinToDate { get; set; }
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}
