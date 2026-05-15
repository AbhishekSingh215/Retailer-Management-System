using Microsoft.AspNetCore.Mvc;
using RMS.Infrastructure.Repositories;
using RMS.Application.DTOs;
using System.Threading.Tasks;

namespace RMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductRepository _repository;

        public ProductController(ProductRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("scan/{scancode}")]
        public async Task<ActionResult<BarcodeScanResponse>> ScanProduct(string scancode)
        {
            if (string.IsNullOrEmpty(scancode))
            {
                return BadRequest(new { message = "Invalid Scancode provided." });
            }

            try
            {
                var result = await _repository.GetProductByScancodeAsync(scancode);
                
                if (result == null)
                {
                    return NotFound(new { message = "Product not found in inventory." });
                }

                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = "An internal error occurred during scan.", details = ex.Message });
            }
        }
    }
}
