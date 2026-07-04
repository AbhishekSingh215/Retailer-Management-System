using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RMS.Application.Interfaces;
using RMS.Application.Services;
using RMS.Infrastructure.Data;
using RMS.Infrastructure.Services;
using RMS.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Configure Infrastructure Services
builder.Services.AddHttpContextAccessor();
builder.Services.AddMemoryCache();

// Register Master Database Context
var masterConnectionString = builder.Configuration.GetConnectionString("MasterConnection") 
    ?? "Server=STATICABHI;Database=RMS_Master;Trusted_Connection=True;TrustServerCertificate=True";
builder.Services.AddDbContext<MasterDbContext>(options =>
    options.UseSqlServer(masterConnectionString));

// Register Multi-Tenant Services
builder.Services.AddSingleton<IEncryptionService, EncryptionService>();
builder.Services.AddScoped<ITenantProvider, TenantProvider>();
builder.Services.AddScoped<ITenantAuthenticationService, TenantAuthenticationService>();

// Configure Dynamic Tenant Database Context
builder.Services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
{
    var tenantProvider = serviceProvider.GetRequiredService<ITenantProvider>();
    var connStr = tenantProvider.GetConnectionString();
    options.UseSqlServer(connStr, o => o
        .UseCompatibilityLevel(120)
        .CommandTimeout(60));
});

// Register Application Services
builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ProductRepository>();
builder.Services.AddScoped<ICrystalReportService, CrystalReportService>();

// Configure JWT Authentication
var secretKey = builder.Configuration["JwtSettings:Secret"] ?? "super-secret-key-that-should-be-very-long-and-secure-1234567890";
var key = Encoding.ASCII.GetBytes(secretKey);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "RMS.API",
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JwtSettings:Audience"] ?? "RMS.Web",
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// VERY IMPORTANT: CORS must be before Auth and HttpsRedirection
app.UseCors("AllowReactFrontend");

// Commented out to prevent CORS preflight redirect issues over HTTP during local dev
// app.UseHttpsRedirection();

// Enable Authentication and Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
