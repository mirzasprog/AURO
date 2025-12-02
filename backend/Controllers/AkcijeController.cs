using backend.Data;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using System.Text;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AkcijeController : ControllerBase
    {
        private readonly Auro2Context _context;
        private readonly IAkcijeRepository _repo;
        private readonly IConfiguration _config;

        public AkcijeController(IAkcijeRepository repo, Auro2Context context, IConfiguration config)
        {
            _context = context;
            _repo = repo;
            _config = config;
        }


        [HttpGet]
        public ActionResult<IEnumerable<AkcijeZaglavljeResponse>> GetAkcijeZaglavlje()
        {
            var r = _repo.PreuzmiAkcijeZaglavlje();
            return Ok(r);
        }

        [HttpGet("{akcijaID}")]
        public ActionResult<IEnumerable<AkcijeStavkeResponse>> GetAkcijeStavke(int akcijaID)
        {
            var r = _repo.PreuzmiAkcijeStavke(akcijaID);
            return Ok(r);
        }

        [HttpGet("{akcijaID}/excel")]
        public IActionResult GetAkcijaStavkeExcel(int akcijaID)
        {
            var stavke = _repo.PreuzmiAkcijeStavke(akcijaID).ToList();

            if (!stavke.Any())
            {
                return NotFound(new { poruka = "Nema stavki za odabranu akciju." });
            }

            var csv = new StringBuilder();
            csv.AppendLine("Sifra;Naziv;Kolicina;Prodavnica");

            foreach (var stavka in stavke)
            {
                var naziv = stavka.Naziv?.Replace("\"", "\"\"") ?? string.Empty;
                var prodavnica = stavka.Prodavnica?.Replace("\"", "\"\"") ?? string.Empty;
                csv.AppendLine($"{stavka.Sifra};\"{naziv}\";{stavka.Kolicina};\"{prodavnica}\"");
            }

            var fileName = $"akcija_{akcijaID}_stavke.csv";
            var content = Encoding.UTF8.GetBytes(csv.ToString());
            return File(content, "text/csv", fileName);
        }

    }
}