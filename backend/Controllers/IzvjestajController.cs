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

    public class IzvjestajController: ControllerBase {
        private readonly Auro2Context _context;
        private readonly IIzvjestajRepository _repo;
        private readonly IConfiguration _config;

        public IzvjestajController(IIzvjestajRepository repo, Auro2Context context, IConfiguration config)
        {
            _context = context;
            _repo = repo;
            _config = config;
        }

        [HttpGet("trgovackaKnjiga")]
        public ActionResult<IEnumerable<IzvjestajTrgovackaKnjigaSintetika>> GetSintetika([FromQuery] DateTime datumOd, [FromQuery] DateTime datumDo) {
            var r = _repo.PreuzmiIzvjestajTrgovackaKnjigaSintetika(datumOd, datumDo);
            var a = _repo.PreuzmiIzvjestajTrgovackaKnjigaAnalitika(datumOd, datumDo);
            return Ok(new { sintetika = r.Item1, ukupnaNaknadaDoDatogPerioda = r.Item2, ukupnaNaknadaZaDatiPeriod = r.Item3, naknadaUkupno = r.Item4, analitika = a} );
        }

        [HttpGet("izdatnica")]
        public ActionResult<IEnumerable<IzvjestajIzdatnica>> GetIzdatnicaIzvjestaj([FromQuery] DateTime datumOd, [FromQuery] DateTime datumDo) {
            var r = _repo.PreuzmiIzvjestajIzdatnica(datumOd, datumDo);
            return Ok(r);
        }
    }

}