using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/vikend-akcije")]
    [ApiController]
    public class VikendAkcijeController : ControllerBase
    {
        private readonly IVikendAkcijeRepository _repository;

        public VikendAkcijeController(IVikendAkcijeRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VikendAkcijaDto>>> GetVikendAkcije()
        {
            var rezultat = await _repository.GetAkcijeAsync();
            return Ok(rezultat);
        }

        [HttpGet("{vikendAkcijaId}/stavke")]
        public async Task<ActionResult<IEnumerable<VikendAkcijaStavkaDto>>> GetStavke(int vikendAkcijaId)
        {
            var stavke = await _repository.GetStavkeAsync(vikendAkcijaId);
            return Ok(stavke);
        }

        [HttpPut("{vikendAkcijaId}/stavke")]
        [Authorize(Roles = "uprava")]
        public async Task<IActionResult> AzurirajStavke(int vikendAkcijaId, [FromBody] IEnumerable<VikendAkcijaStavkaUpdate> izmjene)
        {
            if (izmjene == null)
            {
                return BadRequest(new { poruka = "Nisu proslijeđene stavke za ažuriranje." });
            }

            await _repository.UpdateStavkeAsync(vikendAkcijaId, izmjene);
            return NoContent();
        }
    }
}
