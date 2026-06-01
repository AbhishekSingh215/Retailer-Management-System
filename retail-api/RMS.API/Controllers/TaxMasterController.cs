using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RMS.Application.Interfaces;
using RMS.Core.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace RMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaxMasterController : ControllerBase
    {
        private readonly IApplicationDbContext _context;

        public TaxMasterController(IApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var taxes = await _context.TaxMasters
                    .OrderBy(t => t.TaxRate)
                    .ToListAsync();
                return Ok(taxes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving tax rates.", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            try
            {
                var tax = await _context.TaxMasters.FirstOrDefaultAsync(t => t.TaxId == id);
                if (tax == null) return NotFound(new { message = "Tax rate not found." });
                return Ok(tax);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving tax rate.", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] TaxMaster request)
        {
            try
            {
                if (request == null) return BadRequest(new { message = "Invalid tax data." });

                long maxId = await _context.TaxMasters.MaxAsync(t => (long?)t.TaxId) ?? 0;
                
                var tax = new TaxMaster
                {
                    TaxId = maxId + 1,
                    TaxDescription = request.TaxDescription,
                    TaxDeactive = request.TaxDeactive ?? false,
                    TaxRate = request.TaxRate,
                    TaxCgst = request.TaxCgst,
                    TaxSgst = request.TaxSgst,
                    TaxIgst = request.TaxIgst,
                    TaxUgst = request.TaxUgst ?? 0,
                    TaxType = request.TaxType ?? 0,
                    TaxRecordCreated = DateTime.UtcNow,
                    TaxRecordModified = DateTime.UtcNow,
                    TaxUserId = request.TaxUserId ?? 1,
                    TaxLastModified = request.TaxLastModified ?? 0,
                    TaxLocation = request.TaxLocation ?? 101,
                    TaxMaxPkno = request.TaxMaxPkno ?? 0,
                    TaxTimeStamp = new byte[8]
                };

                _context.TaxMasters.Add(tax);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = tax.TaxId }, tax);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating tax rate.", details = ex.Message, inner = ex.InnerException?.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] TaxMaster request)
        {
            try
            {
                if (request == null) return BadRequest(new { message = "Invalid tax data." });

                var tax = await _context.TaxMasters.FirstOrDefaultAsync(t => t.TaxId == id);
                if (tax == null) return NotFound(new { message = "Tax rate not found." });

                tax.TaxDescription = request.TaxDescription;
                tax.TaxDeactive = request.TaxDeactive;
                tax.TaxRate = request.TaxRate;
                tax.TaxCgst = request.TaxCgst;
                tax.TaxSgst = request.TaxSgst;
                tax.TaxIgst = request.TaxIgst;
                tax.TaxUgst = request.TaxUgst;
                tax.TaxType = request.TaxType;
                tax.TaxRecordModified = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(tax);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating tax rate.", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Deactivate(long id)
        {
            try
            {
                var tax = await _context.TaxMasters.FirstOrDefaultAsync(t => t.TaxId == id);
                if (tax == null) return NotFound(new { message = "Tax rate not found." });

                tax.TaxDeactive = true;
                tax.TaxRecordModified = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Tax rate deactivated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deactivating tax rate.", details = ex.Message });
            }
        }
    }
}
