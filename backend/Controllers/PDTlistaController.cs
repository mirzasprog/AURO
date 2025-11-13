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
    public class PDTlistaController : ControllerBase
    {
        private readonly Auro2Context _context;
        private readonly IPDTlistaRepository _repo;
        private readonly IConfiguration _config;

        public PDTlistaController(IPDTlistaRepository repo, Auro2Context context, IConfiguration config)
        {
            _context = context;
            _repo = repo;
            _config = config;
        }

        [HttpGet("dokumenti")]
        public IActionResult PreuzmiListuDokumenata()
        {
            var r = _repo.PreuzmiPDTdokumente();
            return Ok(r);
        }

        [HttpPost("artikli-vanredni-otpis")]
        public IActionResult PreuzmiArtikle([FromBody] UnosPDTvanredni podaci)
        {
            var r = _repo.PreuzmiPDTartikleVanredniOtpis(podaci);
            return Ok(r);
        }

        [HttpPost("artikli-redovni-otpis")]
        public IActionResult PreuzmiPDTartikleRedovniOtpis([FromBody] UnosPDTredovni podaci)
        {
            var r = _repo.PreuzmiPDTartikleRedovniOtpis(podaci);
            return Ok(r);
        }
        [HttpPost("artikli-izdatnica-troska")]
        public IActionResult PreuzmiPDTartikleIzdatnice([FromBody] UnosPDTIzdatnice podaci)
        {
            podaci.DatumIzradeIzdatnice = podaci.DatumIzradeIzdatnice.ToLocalTime();
            var r = _repo.PreuzmiPDTartikleIzdatnice(podaci);
            return Ok(r);
        }
        [HttpPost("artikli-neuslovna-roba")]
        public IActionResult PreuzmiPDTartikleNeuslovneRobe([FromBody] UnosPDTNeuslovneRobe podaci)
        {
            var r = _repo.PreuzmiPDTartikleNeuslovneRobe(podaci);
            return Ok(r);
        }
    }
}