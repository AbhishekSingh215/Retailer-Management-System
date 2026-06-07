    using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RMS.Application.Interfaces;
using System.Linq;
using System.Threading.Tasks;

namespace RMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CustomerController : ControllerBase
{
    private readonly IApplicationDbContext _context;

    public CustomerController(IApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(string query)
    {
        if (string.IsNullOrWhiteSpace(query)) return Ok(new List<object>());

        var customers = await _context.Customers
            .Where(c => (c.CustomerMobileNo != null && c.CustomerMobileNo.Contains(query)) || 
                        (c.CustomerMobileNo2 != null && c.CustomerMobileNo2.Contains(query)) ||
                        c.CustomerName.Contains(query))
            .Take(10)
            .Select(c => new 
            {
                id = c.CustomerId.ToString(),
                name = c.CustomerName,
                mobile = c.CustomerMobileNo ?? c.CustomerMobileNo2,
                loyaltyPoints = 0 // Add loyalty points field if you have one
            })
            .ToListAsync();

        return Ok(customers);
    }
}
