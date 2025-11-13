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
    public class VanredniOtpisController : ControllerBase
    {
        private readonly Auro2Context _context;
        private readonly IVanredniOtpisRepository _repo;
        private readonly IConfiguration _config;

        public VanredniOtpisController(IVanredniOtpisRepository repo, Auro2Context context, IConfiguration config)
        {
            _context = context;
            _repo = repo;
            _config = config;
        }

        [HttpPost]
        public IActionResult NoviVanredniOtpis(NoviVanredniOtpis o)
        {
            if (!_repo.ArtikalPostoji(o.Sifra))
            {
                return BadRequest(new { poruka = "Artikal nije pronađen!" });
            }

            var r = _repo.DodajVanredniOtpis(o);
            if (r == null)
                return BadRequest(new { poruka = "Unesena količina treba biti cijeli broj!" });
            return Ok(r);
        }        
        
        [HttpPost("reklamacija-kvaliteta")]
        public IActionResult ReklamacijaKvalitet(IEnumerable<tbl_ReklamacijeKvaliteta > lista)
        {
            _repo.ReklamacijaKvaliteta(lista);
            return Ok();
        }

        [HttpPost("nova-vlista")]
        public IActionResult SpremiListuVanrednihOtpisa(IEnumerable<NoviVanredniOtpis> listaVanrednihOtpisa)
        {
            _repo.SpremiListuVanrednihOtpisa(listaVanrednihOtpisa);
            return Ok();
        }

        [HttpGet("pregled")]
        public IActionResult PregledOtpisa([FromQuery] DateTime datumOd, [FromQuery] DateTime datumDo)
        {
            var r = _repo.PregledajOtpise(datumOd, datumDo);
            return Ok(r);
        }

        [HttpGet("pregledReklamacijaKvaliteta")]
        public IActionResult PregledReklamacijaKvaliteta([FromQuery] DateTime datumOd, [FromQuery] DateTime datumDo)
        {
            var r = _repo.PregledReklamacijaKvaliteta(datumOd, datumDo);
            return Ok(r);
        }        
        
        [HttpGet("detaljiArtiklaReklamacije")]
        public IActionResult DetaljiArtiklaReklamacije([FromQuery] string sifraArtikla)
        {
            var r = _repo.DetaljiArtiklaReklamacije(sifraArtikla);
            return Ok(r);
        }

        [HttpGet("{brojOtpisa}")]
        public IActionResult DetaljiOtpisa(string brojOtpisa)
        {
            var r = _repo.PreuzmiDetaljeOtpisa(brojOtpisa);
          //  var odbijeno = _repo.PreuzmiDetaljeOdbijenihOtpisa(brojOtpisa);
            return Ok(r);
        }

        [HttpGet("odbijeno/{brojOtpisa}")]
        public IActionResult DetaljiOdbijenihOtpisa(string brojOtpisa) {
            //var r = _repo.PreuzmiDetaljeOtpisa(brojOtpisa);
            var odbijeno = _repo.PreuzmiDetaljeOdbijenihOtpisa(brojOtpisa);
            return Ok(odbijeno);
           // return Ok(new {odobreniArtikli = r, odbijeniArtikli = odbijeno});
        }

        [HttpGet("odobreno/{brojOtpisa}")]
        public IActionResult DetaljiOdobrenihOtpisa(string brojOtpisa) {
            //var r = _repo.PreuzmiDetaljeOtpisa(brojOtpisa);
            var odobreno = _repo.PreuzmiDetaljeOdobrenihOtpisa(brojOtpisa);
            return Ok(odobreno);
           // return Ok(new {odobreniArtikli = r, odbijeniArtikli = odbijeno});
        }

        [HttpGet("zahtjevi")]
        public IActionResult ZahtjeviVanredniOtpis() {
            var r = _repo.PregledajZahtjeveVanrednihOtpisa();
            return Ok(r);
        }

        [HttpGet("zahtjevi/{brojOtpisa}")]
        public IActionResult ZahtjeviVanredniOtpisDetalji(string brojOtpisa) {
           //  var r = _repo.PregledajZahtjeveVanrednihOtpisaDetalji(brojOtpisa);
           // return Ok(r); 
           var r = _repo.PregledajZahtjeveVanrednihOtpisaDetalji(brojOtpisa);
           var odbijeno = _repo.PreuzmiDetaljeOdbijenihOtpisa(brojOtpisa);
           return Ok(new {odobreniArtikli = r, odbijeniArtikli = odbijeno});
        }

        [HttpPost("odobravanje")]
        public IActionResult Odobravanje(OdobravanjeOtpisa o) {
            _repo.OdobriOtpis(o);
            return Ok();
        }

        [HttpPost("odbijArtikle")]
        public IActionResult OdbijArtikleSaOtpisa([FromBody] ListaOdbijenihArtikala listaOdbijenihArtikala) {	
            _repo.OdbijArtikle(listaOdbijenihArtikala);	
            return Ok();	
        }

        
        [HttpGet("zahtjevi/vanredni/zavrseno")] 
        public IActionResult ZavrseniVanredniZahtjevi([FromQuery] DateTime datumOd, [FromQuery] DateTime datumDo) {
            var r = _repo.PregledajZavrseneVanredneZahtjeve(datumOd, datumDo);
            return Ok(r);
        }
    }
}