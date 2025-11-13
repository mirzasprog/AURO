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
    public class IzdatnicaController : ControllerBase
    {
        private readonly Auro2Context _context;
        private readonly IIzdatnicaRepository _repo;
        private readonly IConfiguration _config;

        public IzdatnicaController(IIzdatnicaRepository repo, Auro2Context context, IConfiguration config)
        {
            _context = context;
            _repo = repo;
            _config = config;
        }

        [HttpPost]

        public IActionResult NovaIzdatnica(NovaIzdatnica i)
        {
            if (!_repo.ArtikalPostoji(i.Sifra))
            {
                return BadRequest(new { poruka = "Artikal nije pronađen!" });
            }

            var r = _repo.DodajIzdatnicu(i);
            if (r == null)
                return BadRequest(new { poruka = "Unesena količina treba biti cijeli broj!" });
            return Ok(r);
        }


        [HttpPost("nova-lista")]
        public IActionResult SpremiListuIzdatnica(IEnumerable<NovaIzdatnica> izdatnice)
        {
            _repo.SpremiListuIzdatnica(izdatnice);
            return Ok();
        }

        [HttpGet("pregled")]
        public IActionResult PreuzmiIzdatnicu([FromQuery] DateTime datumOd, [FromQuery] DateTime datumDo)
        {
            var r = _repo.PreuzmiIzdatnice(datumOd, datumDo);
            return Ok(r);
        }
        [HttpGet("{brojIzdatnice}")]
        public IActionResult DetaljiIzdatnice(string brojIzdatnice) {
            var r = _repo.PreuzmiArtikleIzdatnice(brojIzdatnice);
           // var odbijeno = _repo.PreuzmiDetaljeOdbijenihOtpisa(brojIzdatnice); EDIT
            return Ok(r);  // EDIT  new {odobreniArtikli = r, odbijeniArtikli = odbijeno}
        }

        [HttpGet("zahtjevi")]
        public IActionResult ZahtjeviIzdatnice()
        {
            var r = _repo.PregledajZahtjeveIzdatnica();
            return Ok(r);
        }

        [HttpGet("zahtjevi/{brojIzdatnice}")]
        public IActionResult ZahtjeviIzdatniceDetalji(string brojIzdatnice)
        {
            var r = _repo.PregledajZahtjeveIzdatniceDetalji(brojIzdatnice);
            return Ok(r);
        }
         [HttpGet("interna/pregled")]
        public IActionResult PregledajIzdatniceInterna([FromQuery] DateTime datumOd, [FromQuery] DateTime datumDo) {
            var r = _repo.PregledajIzdatniceInterna(datumOd, datumDo);
            return Ok(r);
        }
    }
}