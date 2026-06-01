using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RMS.Application.Interfaces;
using RMS.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HsnController : ControllerBase
    {
        private readonly IApplicationDbContext _context;

        public HsnController(IApplicationDbContext context)
        {
            _context = context;
        }

        public class HsnDetailDto
        {
            public long HsdId { get; set; }
            public decimal HsdSlabAmount { get; set; }
            public long HsdLowerSlabTax1 { get; set; }
            public long HsdLowerSlabTax2 { get; set; }
            public long HsdSlabTax1 { get; set; }
            public long HsdSlabTax2 { get; set; }
            public DateTime? HsdWefDate { get; set; }
            public bool IsDeactive { get; set; }
        }

        public class HsnDto
        {
            public long HsnId { get; set; }
            public string HsnCode { get; set; } = string.Empty;
            public string HsnDescription { get; set; } = string.Empty;
            public bool HsnDeactive { get; set; }
            public DateTime? HsnWefDate { get; set; }
            public DateTime? HsnWefToDate { get; set; }
            public List<HsnDetailDto> Slabs { get; set; } = new List<HsnDetailDto>();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var hsnList = await _context.Hsns.ToListAsync();
                var slabsList = await _context.HsnDetails.ToListAsync();

                var response = hsnList.Select(h => new HsnDto
                {
                    HsnId = h.HsnId,
                    HsnCode = h.HsnCode,
                    HsnDescription = h.HsnDescription,
                    HsnDeactive = h.HsnDeactive ?? false,
                    HsnWefDate = h.HsnWefDate,
                    HsnWefToDate = h.HsnWefToDate,
                    Slabs = slabsList.Where(s => s.HsdHsnId == h.HsnId).Select(s => new HsnDetailDto
                    {
                        HsdId = s.HsdId,
                        HsdSlabAmount = s.HsdSlabAmount,
                        HsdLowerSlabTax1 = s.HsdLowerSlabTax1,
                        HsdLowerSlabTax2 = s.HsdLowerSlabTax2,
                        HsdSlabTax1 = s.HsdSlabTax1,
                        HsdSlabTax2 = s.HsdSlabTax2,
                        HsdWefDate = s.HsdWefDate,
                        IsDeactive = s.HsdDeactive != null
                    }).ToList()
                }).OrderBy(h => h.HsnCode).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving HSN records.", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            try
            {
                var h = await _context.Hsns.FirstOrDefaultAsync(x => x.HsnId == id);
                if (h == null) return NotFound(new { message = "HSN record not found." });

                var slabs = await _context.HsnDetails
                    .Where(s => s.HsdHsnId == id)
                    .ToListAsync();

                var response = new HsnDto
                {
                    HsnId = h.HsnId,
                    HsnCode = h.HsnCode,
                    HsnDescription = h.HsnDescription,
                    HsnDeactive = h.HsnDeactive ?? false,
                    HsnWefDate = h.HsnWefDate,
                    HsnWefToDate = h.HsnWefToDate,
                    Slabs = slabs.Select(s => new HsnDetailDto
                    {
                        HsdId = s.HsdId,
                        HsdSlabAmount = s.HsdSlabAmount,
                        HsdLowerSlabTax1 = s.HsdLowerSlabTax1,
                        HsdLowerSlabTax2 = s.HsdLowerSlabTax2,
                        HsdSlabTax1 = s.HsdSlabTax1,
                        HsdSlabTax2 = s.HsdSlabTax2,
                        HsdWefDate = s.HsdWefDate,
                        IsDeactive = s.HsdDeactive != null
                    }).ToList()
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving HSN record.", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] HsnDto request)
        {
            try
            {
                if (request == null) return BadRequest(new { message = "Invalid HSN data." });

                long maxHsnId = await _context.Hsns.MaxAsync(h => (long?)h.HsnId) ?? 0;
                long newHsnId = maxHsnId + 1;

                var hsn = new Hsn
                {
                    HsnId = newHsnId,
                    HsnCode = request.HsnCode,
                    HsnDescription = request.HsnDescription,
                    HsnDeactive = request.HsnDeactive,
                    HsnWefDate = request.HsnWefDate,
                    HsnWefToDate = request.HsnWefToDate,
                    HsnRecordCreated = DateTime.UtcNow,
                    HsnRecordModified = DateTime.UtcNow,
                    HsnUserId = 1,
                    HsnLocation = 101,
                    HsnTimestamp = new byte[8],
                    HsnMaxPkno = 0
                };

                _context.Hsns.Add(hsn);
                await _context.SaveChangesAsync();

                long maxHsdId = await _context.HsnDetails.MaxAsync(hd => (long?)hd.HsdId) ?? 0;

                if (request.Slabs != null && request.Slabs.Count > 0)
                {
                    foreach (var slabDto in request.Slabs)
                    {
                        maxHsdId++;
                        var slab = new HsnDetail
                        {
                            HsdId = maxHsdId,
                            HsdHsnId = newHsnId,
                            HsdSlabAmount = slabDto.HsdSlabAmount,
                            HsdLowerSlabTax1 = slabDto.HsdLowerSlabTax1,
                            HsdLowerSlabTax2 = slabDto.HsdLowerSlabTax2,
                            HsdSlabTax1 = slabDto.HsdSlabTax1,
                            HsdSlabTax2 = slabDto.HsdSlabTax2,
                            HsdWefDate = slabDto.HsdWefDate ?? request.HsnWefDate,
                            HsdDeactive = slabDto.IsDeactive ? DateTime.UtcNow : null,
                            HsdRecordCreated = DateTime.UtcNow,
                            HsdRecordModified = DateTime.UtcNow,
                            HsdUserId = 1,
                            HsdLocation = 101,
                            HsdMaxPkno = 0
                        };
                        _context.HsnDetails.Add(slab);
                    }
                    await _context.SaveChangesAsync();
                }

                return CreatedAtAction(nameof(GetById), new { id = hsn.HsnId }, request);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating HSN record.", details = ex.Message, inner = ex.InnerException?.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] HsnDto request)
        {
            try
            {
                if (request == null) return BadRequest(new { message = "Invalid HSN data." });

                var hsn = await _context.Hsns.FirstOrDefaultAsync(x => x.HsnId == id);
                if (hsn == null) return NotFound(new { message = "HSN record not found." });

                hsn.HsnCode = request.HsnCode;
                hsn.HsnDescription = request.HsnDescription;
                hsn.HsnDeactive = request.HsnDeactive;
                hsn.HsnWefDate = request.HsnWefDate;
                hsn.HsnWefToDate = request.HsnWefToDate;
                hsn.HsnRecordModified = DateTime.UtcNow;

                // Handle Slabs
                var existingSlabs = await _context.HsnDetails.Where(s => s.HsdHsnId == id).ToListAsync();
                _context.HsnDetails.RemoveRange(existingSlabs);
                await _context.SaveChangesAsync();

                long maxHsdId = await _context.HsnDetails.MaxAsync(hd => (long?)hd.HsdId) ?? 0;

                if (request.Slabs != null)
                {
                    foreach (var slabDto in request.Slabs)
                    {
                        maxHsdId++;
                        var slab = new HsnDetail
                        {
                            HsdId = maxHsdId,
                            HsdHsnId = id,
                            HsdSlabAmount = slabDto.HsdSlabAmount,
                            HsdLowerSlabTax1 = slabDto.HsdLowerSlabTax1,
                            HsdLowerSlabTax2 = slabDto.HsdLowerSlabTax2,
                            HsdSlabTax1 = slabDto.HsdSlabTax1,
                            HsdSlabTax2 = slabDto.HsdSlabTax2,
                            HsdWefDate = slabDto.HsdWefDate ?? request.HsnWefDate,
                            HsdDeactive = slabDto.IsDeactive ? DateTime.UtcNow : null,
                            HsdRecordCreated = DateTime.UtcNow,
                            HsdRecordModified = DateTime.UtcNow,
                            HsdUserId = 1,
                            HsdLocation = 101,
                            HsdMaxPkno = 0
                        };
                        _context.HsnDetails.Add(slab);
                    }
                    await _context.SaveChangesAsync();
                }

                await _context.SaveChangesAsync();
                return Ok(request);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating HSN record.", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Deactivate(long id)
        {
            try
            {
                var hsn = await _context.Hsns.FirstOrDefaultAsync(x => x.HsnId == id);
                if (hsn == null) return NotFound(new { message = "HSN record not found." });

                hsn.HsnDeactive = true;
                hsn.HsnRecordModified = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "HSN record deactivated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deactivating HSN record.", details = ex.Message });
            }
        }
    }
}
