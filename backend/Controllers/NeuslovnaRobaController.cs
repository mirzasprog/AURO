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
    public class NeuslovnaRobaController : ControllerBase
    {
        private readonly Auro2Context _context;
        private readonly INeuslovnaRobaRepository _repo;
        private readonly IConfiguration _config;

        public NeuslovnaRobaController(INeuslovnaRobaRepository repo, Auro2Context context, IConfiguration config)
        {
            _context = context;
            _repo = repo;
            _config = config;
        }
        
        [HttpPost]
        public IActionResult NovaNeuslovnaRoba(NovaNeuslovnaRoba n)
        {
            if (!_repo.ArtikalPostoji(n.SifraArtikla))
            {
                return BadRequest(new { poruka = "Artikal nije pronađen!" });
            }

            var r = _repo.DodajNeuslovnuRobu(n);
            if (r == null)
                return BadRequest(new { poruka = "Unesena količina treba biti cijeli broj!" });
            return Ok(r);
        }
        
        [HttpPost("nova-lista")]
        public IActionResult SpremiListuNeuslovneRobe(IEnumerable<NovaNeuslovnaRoba> listaNeuslovneRobe) 
        {
            _repo.SpremiListuNeuslovneRobe(listaNeuslovneRobe);
            return Ok();
        }
        [HttpGet("pregled")]
        public IActionResult PreuzmiNeuslovnuRobu([FromQuery] DateTime datumOd, [FromQuery] DateTime datumDo)
        {
            var r = _repo.PreuzmiNeuslovnuRobu(datumOd, datumDo);
            return Ok(r);
        }
        [HttpGet("{brojNeuslovneRobe}")]
        public IActionResult DetaljiNeuslovneRobe(string brojNeuslovneRobe) {
            var r = _repo.PreuzmiArtikleNeuslovneRobe(brojNeuslovneRobe);
           // var odbijeno = _repo.PreuzmiDetaljeOdbijenihOtpisa(brojIzdatnice); EDIT
            return Ok(r);  // EDIT  new {odobreniArtikli = r, odbijeniArtikli = odbijeno}
        }
        [HttpGet("interna/pregled")]
        public IActionResult PregledNeuslovneRobeInterna([FromQuery] DateTime datumOd, [FromQuery] DateTime datumDo) {
            var r = _repo.PregledajNeuslovnuRobuInterna(datumOd, datumDo);
            return Ok(r);
        }
    }
}