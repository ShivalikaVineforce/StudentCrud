using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using studentdemo.Data;
using studentdemo.Models;

namespace studentdemo.Controllers
{
   

    [ApiController]
    [Route("api/[controller]")]
    public class CoutriesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CoutriesController(AppDbContext context) => _context = context;

        [HttpGet]
        [Route("CountryList")]
        public async Task<ActionResult<List<Country>>> GetCountryList() =>
            await _context.Countries.ToListAsync();

        [HttpPost]
        [Route("AddCountries")]
        public async Task<ActionResult<Country>> AddCountries(Country country)
        {
            _context.Countries.Add(country);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCountryList), new { id = country.Id }, country);
        }

    }
}



