using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using studentdemo.Data;
using studentdemo.Models;
namespace studentdemo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AddressCategoryController : ControllerBase
    {
        private readonly AppDbContext _context;
        public AddressCategoryController(AppDbContext context) => _context = context;

        [HttpGet]
        [Route("GetAddressCategory")]
        public async Task<ActionResult<List<AddressCategory>>> GetAddressCategory() =>
            await _context.AddressCategory.ToListAsync();

        [HttpPost]
        [Route("AddAddressCategory")]
        public async Task<ActionResult<AddressCategory>> AddClasses(AddressCategory addressCategory)
        {
            try {
                if (await _context.AddressCategory.AnyAsync(c => c.AddressCategoryName == addressCategory.AddressCategoryName))
                {
                    return BadRequest(new { message = "Address Category Name already exists." });
                }

                _context.AddressCategory.Add(addressCategory);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetAddressCategory), new { id = addressCategory.Id }, addressCategory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

    }
}

