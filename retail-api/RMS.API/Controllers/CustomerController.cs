using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RMS.Application.Interfaces;
using RMS.Core.Entities;
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

    [HttpGet]
    public async Task<IActionResult> Customer(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] bool showInactive = false,
        [FromQuery] string? sortField = "customerName",
        [FromQuery] string? sortDir = "asc")
    {
        var query = from cust in _context.Customers
                    join city in _context.Cities on cust.CustomerCityId equals city.CityId into cityGroup
                    from city in cityGroup.DefaultIfEmpty()
                    join state in _context.States on city.CityStateId equals state.StateId into stateGroup
                    from state in stateGroup.DefaultIfEmpty()
                    join country in _context.Countries on state.StateCountryId equals country.CountryId into countryGroup
                    from country in countryGroup.DefaultIfEmpty()
                    select new {
                        cust,
                        cityName = city != null ? city.CityName : null,
                        cityStateId = city != null ? (long?)city.CityStateId : null,
                        stateName = state != null ? state.StateName : null,
                        stateCountryId = state != null ? (long?)state.StateCountryId : null,
                        countryName = country != null ? country.CountryName : null
                    };

        if (!showInactive)
        {
            query = query.Where(x => x.cust.CustomerDeActive == null || x.cust.CustomerDeActive == false);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(x => 
                x.cust.CustomerName.ToLower().Contains(s) ||
                (x.cust.CustomerCode != null && x.cust.CustomerCode.ToLower().Contains(s)) ||
                (x.cust.CustomerNickName != null && x.cust.CustomerNickName.ToLower().Contains(s)) ||
                (x.cust.CustomerMobileNo != null && x.cust.CustomerMobileNo.Contains(s)) ||
                (x.cust.CustomerEmailId != null && x.cust.CustomerEmailId.ToLower().Contains(s)) ||
                (x.cust.CustomerGstNo != null && x.cust.CustomerGstNo.ToLower().Contains(s))
            );
        }

        var isDesc = sortDir?.ToLower() == "desc";
        var field = sortField?.ToLower() ?? "customername";

        if (field == "customercode")
        {
            query = isDesc ? query.OrderByDescending(x => x.cust.CustomerCode) : query.OrderBy(x => x.cust.CustomerCode);
        }
        else if (field == "customerid")
        {
            query = isDesc ? query.OrderByDescending(x => x.cust.CustomerId) : query.OrderBy(x => x.cust.CustomerId);
        }
        else
        {
            query = isDesc ? query.OrderByDescending(x => x.cust.CustomerName) : query.OrderBy(x => x.cust.CustomerName);
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => new {
                CustomerId = x.cust.CustomerId,
                CustomerName = x.cust.CustomerName,
                CustomerNickName = x.cust.CustomerNickName ?? "",
                CustomerCode = x.cust.CustomerCode ?? "",
                CustomerGender = x.cust.CustomerGender == 1 ? "Male" : x.cust.CustomerGender == 2 ? "Female" : x.cust.CustomerGender == 3 ? "Other" : "",
                CustomerMobileNo = x.cust.CustomerMobileNo ?? "",
                CustomerMobileNo2 = x.cust.CustomerMobileNo2 ?? "",
                CustomerEmailID = x.cust.CustomerEmailId ?? "",
                CustomerAddress1 = x.cust.CustomerAddress1 ?? "",
                CustomerAddress2 = x.cust.CustomerAddress2 ?? "",
                CustomerAddress3 = x.cust.CustomerAddress3 ?? "",
                CustomerPincode = x.cust.CustomerPincode != null ? x.cust.CustomerPincode.ToString() : "",
                CustomerLocation = x.cust.CustomerLocation != null ? x.cust.CustomerLocation.ToString() : "",
                CustomerGstNo = x.cust.CustomerGstNo ?? "",
                CustomerPanNo = x.cust.CustomerPanNo ?? "",
                CustomerGstType = x.cust.CustomerGstType,
                CustomerBirthDate = x.cust.CustomerBirthDate,
                CustomerAnnDate = x.cust.CustomerAnnDate,
                CustomerRemarks = x.cust.CustomerRemarks ?? "",
                CustomerDeActive = x.cust.CustomerDeActive ?? false,
                CityId = x.cust.CustomerCityId,
                CityName = x.cityName,
                StateId = x.cityStateId,
                StateName = x.stateName,
                CountryId = x.stateCountryId,
                CountryName = x.countryName
            })
            .ToListAsync();

        var hasMore = (page * pageSize) < totalCount;

        return Ok(new { items, hasMore, totalCount });
    }


    [HttpGet("{id}")]
    public async Task<IActionResult> GetCustomerByID(long id)
    {
        var customer = await (from cust in _context.Customers
                              join city in _context.Cities on cust.CustomerCityId equals city.CityId into cityGroup
                              from city in cityGroup.DefaultIfEmpty()
                              join state in _context.States on city.CityStateId equals state.StateId into stateGroup
                              from state in stateGroup.DefaultIfEmpty()
                              join country in _context.Countries on state.StateCountryId equals country.CountryId into countryGroup
                              from country in countryGroup.DefaultIfEmpty()
                              where cust.CustomerId == id
                              select new {
                                  CustomerId = cust.CustomerId,
                                  CustomerName = cust.CustomerName,
                                  CustomerNickName = cust.CustomerNickName ?? "",
                                  CustomerCode = cust.CustomerCode ?? "",
                                  CustomerGender = cust.CustomerGender == 1 ? "Male" : cust.CustomerGender == 2 ? "Female" : cust.CustomerGender == 3 ? "Other" : "",
                                  CustomerMobileNo = cust.CustomerMobileNo ?? "",
                                  CustomerMobileNo2 = cust.CustomerMobileNo2 ?? "",
                                  CustomerEmailID = cust.CustomerEmailId ?? "",
                                  CustomerAddress1 = cust.CustomerAddress1 ?? "",
                                  CustomerAddress2 = cust.CustomerAddress2 ?? "",
                                  CustomerAddress3 = cust.CustomerAddress3 ?? "",
                                  CustomerPincode = cust.CustomerPincode != null ? cust.CustomerPincode.ToString() : "",
                                  CustomerLocation = cust.CustomerLocation != null ? cust.CustomerLocation.ToString() : "",
                                  CustomerGstNo = cust.CustomerGstNo ?? "",
                                  CustomerPanNo = cust.CustomerPanNo ?? "",
                                  CustomerGstType = cust.CustomerGstType,
                                  CustomerBirthDate = cust.CustomerBirthDate,
                                  CustomerAnnDate = cust.CustomerAnnDate,
                                  CustomerRemarks = cust.CustomerRemarks ?? "",
                                  CustomerDeActive = cust.CustomerDeActive ?? false,
                                  CityId = cust.CustomerCityId,
                                  CityName = city != null ? city.CityName : null,
                                  StateId = city != null ? (long?)city.CityStateId : null,
                                  StateName = state != null ? state.StateName : null,
                                  CountryId = state != null ? (long?)state.StateCountryId : null,
                                  CountryName = country != null ? country.CountryName : null
                              })
                              .FirstOrDefaultAsync();

        if (customer == null)
        {
            return NotFound(new { message = "Customer not found" });
        }

        return Ok(customer);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CustomerRequest request)
    {
        try
        {
            if (request == null) return BadRequest(new { message = "Invalid customer data." });

            long maxId = await _context.Customers.MaxAsync(c => (long?)c.CustomerId) ?? 0;

            int? dbGender = null;
            if (request.CustomerGender == "Male") dbGender = 1;
            else if (request.CustomerGender == "Female") dbGender = 2;
            else if (request.CustomerGender == "Other") dbGender = 3;

            decimal? pincode = null;
            if (decimal.TryParse(request.CustomerPincode, out decimal pVal)) pincode = pVal;

            long? location = null;
            if (long.TryParse(request.CustomerLocation, out long lVal)) location = lVal;

            var customer = new Customer
            {
                CustomerId = maxId + 1,
                CustomerName = request.CustomerName,
                CustomerNickName = request.CustomerNickName,
                CustomerCode = request.CustomerCode ?? "",
                CustomerGender = dbGender,
                CustomerMobileNo = request.CustomerMobileNo,
                CustomerMobileNo2 = request.CustomerMobileNo2,
                CustomerEmailId = request.CustomerEmailID,
                CustomerAddress1 = request.CustomerAddress1,
                CustomerAddress2 = request.CustomerAddress2,
                CustomerAddress3 = request.CustomerAddress3,
                CustomerPincode = pincode,
                CustomerLocation = location,
                CustomerGstNo = request.CustomerGstNo,
                CustomerPanNo = request.CustomerPanNo,
                CustomerGstType = request.CustomerGstType,
                CustomerBirthDate = request.CustomerBirthDate,
                CustomerAnnDate = request.CustomerAnnDate,
                CustomerRemarks = request.CustomerRemarks,
                CustomerDeActive = request.CustomerDeActive ?? false,
                CustomerRecordCreated = DateTime.UtcNow,
                CustomerRecordModified = DateTime.UtcNow,
                CustomerTimeStamp = new byte[8]
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCustomerByID), new { id = customer.CustomerId }, customer);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error creating customer.", details = ex.Message, inner = ex.InnerException?.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(long id, [FromBody] CustomerRequest request)
    {
        try
        {
            if (request == null) return BadRequest(new { message = "Invalid customer data." });

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.CustomerId == id);
            if (customer == null) return NotFound(new { message = "Customer not found." });

            int? dbGender = null;
            if (request.CustomerGender == "Male") dbGender = 1;
            else if (request.CustomerGender == "Female") dbGender = 2;
            else if (request.CustomerGender == "Other") dbGender = 3;

            decimal? pincode = null;
            if (decimal.TryParse(request.CustomerPincode, out decimal pVal)) pincode = pVal;

            long? location = null;
            if (long.TryParse(request.CustomerLocation, out long lVal)) location = lVal;

            customer.CustomerName = request.CustomerName;
            customer.CustomerNickName = request.CustomerNickName;
            customer.CustomerCode = request.CustomerCode;
            customer.CustomerGender = dbGender;
            customer.CustomerMobileNo = request.CustomerMobileNo;
            customer.CustomerMobileNo2 = request.CustomerMobileNo2;
            customer.CustomerEmailId = request.CustomerEmailID;
            customer.CustomerAddress1 = request.CustomerAddress1;
            customer.CustomerAddress2 = request.CustomerAddress2;
            customer.CustomerAddress3 = request.CustomerAddress3;
            customer.CustomerPincode = pincode;
            customer.CustomerLocation = location;
            customer.CustomerGstNo = request.CustomerGstNo;
            customer.CustomerPanNo = request.CustomerPanNo;
            customer.CustomerGstType = request.CustomerGstType;
            customer.CustomerBirthDate = request.CustomerBirthDate;
            customer.CustomerAnnDate = request.CustomerAnnDate;
            customer.CustomerRemarks = request.CustomerRemarks;
            customer.CustomerDeActive = request.CustomerDeActive;
            customer.CustomerRecordModified = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(customer);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error updating customer.", details = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Deactivate(long id)
    {
        try
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.CustomerId == id);
            if (customer == null) return NotFound(new { message = "Customer not found." });

            customer.CustomerDeActive = true;
            customer.CustomerRecordModified = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "Customer deactivated successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error deactivating customer.", details = ex.Message });
        }
    }
}

public class CustomerRequest
{
    public long CustomerId { get; set; }
    public string CustomerName { get; set; } = null!;
    public string? CustomerNickName { get; set; }
    public string? CustomerCode { get; set; }
    public string? CustomerGender { get; set; }
    public string? CustomerMobileNo { get; set; }
    public string? CustomerMobileNo2 { get; set; }
    public string? CustomerEmailID { get; set; }
    public string? CustomerAddress1 { get; set; }
    public string? CustomerAddress2 { get; set; }
    public string? CustomerAddress3 { get; set; }
    public string? CustomerPincode { get; set; }
    public string? CustomerLocation { get; set; }
    public string? CustomerGstNo { get; set; }
    public string? CustomerPanNo { get; set; }
    public int? CustomerGstType { get; set; }
    public System.DateTime? CustomerBirthDate { get; set; }
    public System.DateTime? CustomerAnnDate { get; set; }
    public string? CustomerRemarks { get; set; }
    public bool? CustomerDeActive { get; set; }
}



