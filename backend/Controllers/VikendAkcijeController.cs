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

        [HttpGet("{akcijaId}/artikli")]
        public async Task<ActionResult<IEnumerable<VipArtikalDto>>> GetVipArtikli(string akcijaId)
        {
            if (string.IsNullOrWhiteSpace(akcijaId))
            {
                return BadRequest(new { poruka = "Nedostaje ID akcije." });
            }

            var artikli = await _repository.GetVipArtikliAsync(akcijaId);
            return Ok(artikli);
        }

        [HttpGet("{vikendAkcijaId}/stavke")]
        public async Task<ActionResult<IEnumerable<VikendAkcijaStavkaDto>>> GetStavke(string vikendAkcijaId)
        {
            var stavke = await _repository.GetStavkeAsync(vikendAkcijaId);
            return Ok(stavke);
        }

        [HttpPut("{vikendAkcijaId}/stavke")]
        [Authorize(Roles = "prodavnica,podrucni,regionalni,uprava")]
        public async Task<IActionResult> AzurirajStavke(string vikendAkcijaId, [FromBody] IEnumerable<VikendAkcijaStavkaUpdate> izmjene)
        {
            if (izmjene == null)
            {
                return BadRequest(new { poruka = "Nisu proslijeđene stavke za ažuriranje." });
            }

            var rezultat = await _repository.UpdateStavkeAsync(vikendAkcijaId, izmjene);

            if (!rezultat.AkcijaPronadjena)
            {
                return NotFound(new { poruka = "Vikend akcija sa zadanim ID-jem nije pronađena." });
            }

            var ukupno = rezultat.BrojAzuriranih + rezultat.BrojDodanih;
            var poruka = ukupno > 0
                ? $"Stavke su uspješno spremljene ({rezultat.BrojAzuriranih} ažurirano, {rezultat.BrojDodanih} dodano)."
                : "Nema izmjena za snimanje.";

            return Ok(new { poruka, rezultat.BrojAzuriranih, rezultat.BrojDodanih });
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
