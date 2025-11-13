using backend.Data;
using Microsoft.AspNetCore.Mvc;
using backend.Entities;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class KontrolneInventureController : ControllerBase
    {
        private readonly Auro2Context _context;
        private readonly IKontrolneInventureRepository _repo;
        private readonly IConfiguration _config;

        public KontrolneInventureController(IKontrolneInventureRepository repo, Auro2Context context, IConfiguration config)
        {
            _context = context;
            _repo = repo;
            _config = config;
        }

        [HttpGet]
        public IActionResult PreuzmiKontrolneInventure() 
        {
            var r = _repo.PreuzmiKontrolneInventure();
            return Ok(r);
        }

    }
}