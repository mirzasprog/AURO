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
    public class RedovniOtpisController : ControllerBase
    {
        private readonly Auro2Context _context;
        private readonly IRedovniOtpisRepository _repo;
        private readonly IConfiguration _config;

        public RedovniOtpisController(IRedovniOtpisRepository repo, Auro2Context context, IConfiguration config)
        {
            _context = context;
            _repo = repo;
            _config = config;
        }
        
        [HttpPost]
        public IActionResult NoviRedovniOtpis(NoviRedovniOtpis o)
        {
            if (!_repo.ArtikalPostoji(o.Sifra))
            {
                return BadRequest(new { poruka = "Artikal nije pronađen!" });
            }

            var r = _repo.DodajOtpis(o);
            if (r == null)
                return BadRequest(new { poruka = "Unesena količina treba biti cijeli broj!" });
            return Ok(r);
        }
        
        [HttpPost("nova-lista")]
        public IActionResult SpremiListuOtpisa(IEnumerable<NoviRedovniOtpis> listaOtpisa) 
        {
            _repo.SpremiListuOtpisa(listaOtpisa);
            return Ok();
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

        [HttpPost("nema-otpisa")]
        public IActionResult SpremiProdavnicaNemaOtpisa() 
        {
            _repo.SpremiProdavnicaNemaOtpisa();
            return Ok();
        }

        [HttpGet]
        public IActionResult ProvjeraOtpisOmogucen() {
            bool prijavljenOtpis = _repo.NemaOtpisa();
            bool omogucen =_repo.OmogucenDatumOtpisa();
            return Ok(new {omogucenUnosOtpisa = omogucen, nemaOtpisa = prijavljenOtpis});
        }        
        
        [HttpGet("provjeriOdobravanjeInventure")]
        public IActionResult ProvjeraOdobravanjeInventure() {
            bool omogucen =_repo.ProvjeraOdobravanjeInventure();
            return Ok(new {unos = omogucen,});
        }

        [HttpGet("pregled")]
        public IActionResult PregledOtpisa([FromQuery] DateTime datumOd, [FromQuery] DateTime datumDo) {
            var r = _repo.PregledajOtpise(datumOd, datumDo);
            return Ok(r);
        }
        [HttpGet("pregled-statistike")]
        public IActionResult PregledStatistikeRedovnogOtpisa() {
            var r = _repo.PregledajStatistikuRedovnogOtpisa();
            return Ok(r);
        }
        [HttpGet("pregled-dinamike")]
        public IActionResult PregledDinamikeOtpisa([FromQuery] DateTime datumOd, [FromQuery] DateTime datumDo) {
            var r = _repo.PregledajDinamikuOtpisa(datumOd, datumDo);
            return Ok(r);
        }

        [HttpGet("interna/pregled")]
        public IActionResult PregledOtpisaInterna([FromQuery] DateTime datumOd, [FromQuery] DateTime datumDo) {
            var r = _repo.PregledajOtpiseInterna(datumOd, datumDo);
            return Ok(r);
        }

        [HttpGet("interna/pregled-vo")]
        public IActionResult PregledVanrednihOtpisaInterna([FromQuery] DateTime datumOd, [FromQuery] DateTime datumDo) {
            var r = _repo.PregledajVanredneOtpiseInterna(datumOd, datumDo);
            return Ok(r);
        }

        [HttpGet("interna/pregled/nemaOtpisa")]
        public IActionResult PregledInternaNemaOtpisa([FromQuery] DateTime datumOd, [FromQuery] DateTime datumDo) {
            var r = _repo.PregledInternaNemaOtpisa(datumOd, datumDo);
            return Ok(r);
        }

        [HttpGet("redovni/nemaOtpisa")]
        public IActionResult PregledNemaOtpisa([FromQuery] DateTime datumOd, [FromQuery] DateTime datumDo) {
            var r = _repo.PregledNemaOtpisa(datumOd, datumDo);
            return Ok(r);
        }

        [HttpPost("interna/unos-datuma")]
        public IActionResult UnosDatumaOtpisa(UnosDatumaOtpisa datum) {
             _repo.UnosDatumaOtpisa(datum);
            return Ok();
        }       
         [HttpPost("interna/unos-datuma-inventure")]
        public IActionResult UnosDatumaInventure(UnosDatumaOtpisa datum) {
             _repo.UnosDatumaInventure(datum);
            return Ok();
        }

        [HttpGet("{brojOtpisa}")]
        public IActionResult DetaljiOtpisa(string brojOtpisa) {
            var r = _repo.PreuzmiDetaljeOtpisa(brojOtpisa);
           // var odbijeno = _repo.PreuzmiDetaljeOdbijenihOtpisa(brojOtpisa);
           return Ok (r);
           // return Ok(new {odobreniArtikli = r, odbijeniArtikli = odbijeno});
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
        public IActionResult ZahtjeviRedovniOtpis() {
            var r = _repo.PregledajZahtjeveRedovnihOtpisa();
            return Ok(r);
        }

        [HttpGet("zahtjevi/{brojOtpisa}")]
        public IActionResult ZahtjeviRedovniOtpisDetalji(string brojOtpisa) {
            var r = _repo.PregledajZahtjeveRedovnihOtpisaDetalji(brojOtpisa);
            var odbijeno = _repo.PreuzmiDetaljeOdbijenihOtpisa(brojOtpisa);
            return Ok(new {odobreniArtikli = r, odbijeniArtikli = odbijeno});
        }

        [HttpGet("zahtjevi/redovni/zavrseno")] 
        public IActionResult ZavrseniRedovniZahtjevi([FromQuery] DateTime datumOd, [FromQuery] DateTime datumDo) {
            var r = _repo.PregledajZavrseneRedovneZahtjeve(datumOd, datumDo);
            return Ok(r);
        }

         [HttpGet("statistika")]
        public IActionResult PregledStatistike() {
            var r = _repo.PregledajStatistiku();
            return Ok(r);
        } 


    }
}