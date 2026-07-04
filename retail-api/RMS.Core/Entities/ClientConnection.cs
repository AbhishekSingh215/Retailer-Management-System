using System;

namespace RMS.Core.Entities;

public class ClientConnection
{
    public string UserId { get; set; } = string.Empty; // Primary identifier for login lookup
    public string ClientId { get; set; } = string.Empty;
    public string UserPassword { get; set; } = string.Empty;
    public string ConnectionString { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
