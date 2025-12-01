using System;
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

        [HttpPost]
        [Authorize(Roles = "uprava")]
        public async Task<ActionResult<VikendAkcijaDto>> Kreiraj([FromBody] VikendAkcijaCreateRequest zahtjev)
        {
            if (zahtjev == null || zahtjev.Pocetak == default || zahtjev.Kraj == default)
            {
                return BadRequest(new { poruka = "Nedostaju obavezni podaci za kreiranje akcije." });
            }

            if (zahtjev.Kraj < zahtjev.Pocetak)
            {
                return BadRequest(new { poruka = "Datum završetka mora biti nakon datuma početka." });
            }

            var akcija = await _repository.KreirajAkcijuAsync(zahtjev);
            return Ok(akcija);
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

        [HttpPost("artikli-import")]
        [Authorize(Roles = "uprava")]
        public async Task<IActionResult> ImportArtikala([FromForm] VikendAkcijaArtikliUploadRequest zahtjev)
        {
            if (zahtjev.File == null || string.IsNullOrWhiteSpace(zahtjev.AkcijaId))
            {
                return BadRequest(new { poruka = "Potrebno je proslijediti ID akcije i Excel fajl." });
            }

            try
            {
                var rezultat = await _repository.ImportArtikalaAsync(zahtjev.AkcijaId, zahtjev.File);
                return Ok(rezultat);
            }
            catch (Exception ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }
    }
}
