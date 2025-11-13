using backend.Data;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Entities;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UcesniciInventureController : ControllerBase
    {
        private readonly Auro2Context _context;
        private readonly IUcesniciInventureRepository _repo;
        private readonly IConfiguration _config;

        public UcesniciInventureController(IUcesniciInventureRepository repo, Auro2Context context, IConfiguration config)
        {
            _context = context;
            _repo = repo;
            _config = config;
        }

        [HttpPost]

        public IActionResult NoviUnos(UnosUcesnikaInventure i)
        {
            var r = _repo.DodajUnos(i);
            return Ok(r);
        }
        [HttpPost("nova-lista")]
        public IActionResult SpremiListuUcesnika(IEnumerable<UnosUcesnikaInventure> ucesnici)
        {
            _repo.SpremiListuUcesnika(ucesnici);
            return Ok();
        }
        [HttpGet("pregled")]
        public IActionResult PregledajUcesnikeInvenure([FromQuery] DateTime datumOd, [FromQuery] DateTime datumDo)
        {
            var r = _repo.PregledajUcesnikeInvenure(datumOd, datumDo);
            return Ok(r);
        }


    }
}