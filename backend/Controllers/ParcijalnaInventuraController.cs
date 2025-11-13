using backend.Data;
using backend.Entities;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Auro.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]

    public class ParcijalnaInventuraController : ControllerBase
    {
        private readonly IParcijalnaInventuraRepository _repo;

        public ParcijalnaInventuraController(IParcijalnaInventuraRepository repo)
        {
            _repo = repo;
        }

        [HttpPost("excel")]
        public IActionResult ImportExcelaZaposlenika(IEnumerable<ListaZaposlenikaParcijalneInventure> zaposlenici)
        {
            _repo.SpremiUbazu(zaposlenici);
            return Ok();
        }

        [HttpGet("zaposlenici/{brojProdavnice}")]
        public ActionResult<ResponseZaposleniciParcijalneInventure> GetListaZaposlenika(string brojProdavnice)
        {
            var r = _repo.GetZaposleniciParcijalneInventure(brojProdavnice);
            return Ok(r);
        }

        [HttpPost]
        public IActionResult SpremiZaposlenikeParcijalneInventure([FromBody] RequestParcijalneInventure podaci)
        {
            _repo.SpremiParcijalneInventure(podaci);
            return Ok();
        }

        [HttpGet("podrucni")]
        public ActionResult<ResponseParcijalneInventurePodrucni> GetParcijalneInventurePodrucniStavke([FromQuery] string datum, [FromQuery] string brojProdavnice, [FromQuery] string brojDokumenta)
        {
            var r = _repo.GetParcijalneInventurePodrucniStavke(datum, brojProdavnice, brojDokumenta);
            return Ok(r);
        }

        [HttpGet("podrucni/zaglavlje")]
        public ActionResult<ResponseParcijalneInventurePodrucniZaglavlje> GetParcijalneInventurePodrucniZaglavlje([FromQuery]string datum)
        {
            var r = _repo.GetParcijalneInventurePodrucniZaglavlje(datum);
            return Ok(r);
        }         
        
        [HttpGet("interna/zaglavlje")]
        public ActionResult<ResponseParcijalneInventurePodrucniZaglavlje> GetParcijalneInventureInternaZaglavlje([FromQuery]string datum)
        {
            var r = _repo.GetParcijalneInventureInternaZaglavlje(datum);
            return Ok(r);
        }        
        
        [HttpGet("uposlenici")]
        public ActionResult<ImenaUposlenikaNaInventuri> GetUposlenici()
        {
            var r = _repo.GetUposlenici();
            return Ok(r);
        }
       
        [HttpGet("podaciUposlenikaPotpunaInv")]
        public ActionResult<PodaciUposlenikaParcijalnaInv> GetPodaciUposlenikaPotpunaInv([FromQuery] string ime, [FromQuery] string prezime)
        {
            var r = _repo.GetPodaciUposlenikaPotpunaInv(ime, prezime);
            return Ok(r);
        }

        [HttpPost("podrucni/odobravanje")]
        public IActionResult PodrucniOdobriOdbijParcijalnuInventuru(PodrucniOdobriOdbijeParcijalnuInventuru unos)
        {
            _repo.PodrucniOdobriOdbijParcijalnuInventuru(unos);
            return Ok();
        }

        [HttpGet("internaKontrola/izvjestaj")]
        public ActionResult<IzvjestajParcijalnaInventuraInternaKontrola> GetIzvjestajParcijalnihInventura([FromQuery] string datumInventure, string vrstaInventure)
        {
            var r = _repo.GetIzvjestajParcijalnihInventuraZaInternuKontrolu(datumInventure, vrstaInventure);
            return Ok(r);
        }        
        
        [HttpGet("internaKontrola/izvjestaj/poptunaInventura")]
        public ActionResult<IzvjestajParcijalnaInventuraInternaKontrola> GetIzvjestajPotpunihInventura([FromQuery] string datumInventure, string vrstaInventure)
        {
            var r = _repo.GetIzvjestajPotpunihInventuraZaInternuKontrolu(datumInventure, vrstaInventure);
            return Ok(r);
        }

        [HttpGet("podrucni/prodavnice")]
        public ActionResult<List<string>> GetProdavniceParcijalneInventureNezavrseno([FromQuery]string datumInventure)
        {
            var r = _repo.GetProdavniceParcijalnaInventuraNezavrseno(datumInventure);
            return Ok(r);
        }

        [HttpPost("podrucni/listaParcijalnihInventura")]
        public IActionResult SpremiListuParcijalnihInventura(IEnumerable<PodrucniOdobriOdbijeParcijalnuInventuru> unos)
        {
            _repo.SpremiListuParcijalnihInventura(unos);
            return Ok();
        }

        [HttpPost("interna/obradaZahtjeva")]
        public IActionResult ObradiZahtjev([FromBody] ObradaZahtjevaDto zahtjev)
        {
            _repo.ObradiZahtjev(zahtjev);
            return Ok();
        }


    }
}