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
        public async Task<ActionResult<List<AddressCategory>>> GetCategories() =>
            await _context.AddressCategory.ToListAsync();



    }
}

