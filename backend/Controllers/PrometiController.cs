using backend.Data;
using Microsoft.AspNetCore.Mvc;
using backend.Entities;
using Microsoft.AspNetCore.Authorization;
using backend.Models;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PrometiController : ControllerBase
    {
        private readonly Auro2Context _context;
        private readonly IPrometiRepository _repo;
        private readonly IConfiguration _config;

        public PrometiController(IPrometiRepository repo, Auro2Context context, IConfiguration config)
        {
            _context = context;
            _repo = repo;
            _config = config;
        }

        [HttpGet("{prodavnica}")]
        public IActionResult PreuzmiPrometProdavnice(string prodavnica)
        {
            var r = _repo.PreuzmiPrometProdavnice(prodavnica);
            return Ok(r);
        }


        [HttpGet]
        public IActionResult PreuzmiPromete()
        {
            var r = _repo.PreuzmiPrometeSvihProdavnica();
            return Ok(r);
        }        
        
        [HttpGet("sviPrometi")]
        public IActionResult PreuzmiSvePromete()
        {
            var r = _repo.PreuzmiSvePromete();
            return Ok(r);
        }

    }
}