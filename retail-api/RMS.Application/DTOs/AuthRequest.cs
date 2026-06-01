using System;

namespace RMS.Application.DTOs;

public class AuthRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public DateTime? LoginDate { get; set; }
}
