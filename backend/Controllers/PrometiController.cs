using backend.Data;
using Microsoft.AspNetCore.Mvc;
using backend.Entities;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using System.Linq;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PrometiController : ControllerBase
    {
        private readonly Auro2Context _context;
        private readonly IPrometiRepository _repo;
        private readonly IConfiguration _config;

        public PrometiController(IPrometiRepository repo, Auro2Context context, IConfiguration config)
        {
            _context = context;
            _repo = repo;
            _config = config;
        }

        [HttpGet("{prodavnica}")]
        public IActionResult PreuzmiPrometProdavnice(string prodavnica)
        {
            var r = _repo.PreuzmiPrometProdavnice(prodavnica);
            if (r == null)
            {
                return NotFound();
            }

            var netoKvadratura = r.NetoKvadraturaObjekta ?? 0;
            var prometPoKvadraturi = netoKvadratura > 0 ? Math.Round(r.Promet / netoKvadratura, 2) : 0;

            var br_Zaposlenih = r.BrojZaposlenih ?? 0;
            var prometPoZaposlenom = r.PrometPoZaposlenom ?? (br_Zaposlenih > 0 ? Math.Round(r.Promet / br_Zaposlenih, 2) : 0);

            return Ok(new ResponsePrometProdavnice
            {
                BrojProdavnice = r.BrojProdavnice,
                Adresa = r.Adresa,
                Format = r.Format,
                Regija = r.Regija,
                Promet = r.Promet,
                PrometProslaGodina = r.PrometProslaGodina,
                BrojKupaca = r.BrojKupaca,
                BrojKupacaProslaGodina = r.BrojKupacaProslaGodina,
                NetoKvadraturaObjekta = netoKvadratura,
                BrojZaposlenih = br_Zaposlenih,
                PrometPoNetoKvadraturi = prometPoKvadraturi,
                PrometProslaGodinaPoNetoKvadraturi = r.PrometProslaGodinaPoNetoKvadraturi,
                PrometPoZaposlenom = prometPoZaposlenom,
                PrometPoUposleniku = prometPoZaposlenom
            });
        }


        [HttpGet]
        public IActionResult PreuzmiPromete()
        {
            var r = _repo.PreuzmiPrometeSvihProdavnica();
            if (r == null)
            {
                return NotFound();
            }

            var netoKvadratura = r.NetoKvadraturaObjekta ?? 0;
            var prometPoKvadraturi = netoKvadratura > 0 && r.Promet.HasValue
                ? Math.Round(r.Promet.Value / netoKvadratura, 2)
                : 0;

            var br_Zaposlenih = r.BrojZaposlenih ?? 0;
            var prometPoZaposlenom = r.PrometPoZaposlenom ?? (br_Zaposlenih > 0 && r.Promet.HasValue
                ? Math.Round(r.Promet.Value / br_Zaposlenih, 2)
                : 0);

            return Ok(new ResponsePrometiProdavnica
            {
                BrojProdavnice = r.BrojProdavnice,
                Regija = r.Regija,
                Format = r.Format,
                Adresa = r.Adresa,
                Promet = r.Promet,
                PrometProslaGodina = r.PrometProslaGodina,
                BrojKupaca = r.BrojKupaca,
                BrojKupacaProslaGodina = r.BrojKupacaProslaGodina,
                NetoKvadraturaObjekta = netoKvadratura,
                BrojZaposlenih = br_Zaposlenih,
                PrometPoNetoKvadraturi = prometPoKvadraturi,
                PrometPoZaposlenom = prometPoZaposlenom,
                PrometProslaGodinaPoNetoKvadraturi = r.PrometProslaGodinaPoNetoKvadraturi,
                PrometPoUposleniku = prometPoZaposlenom
            });
        }
        
        [HttpGet("sviPrometi")]
        public IActionResult PreuzmiSvePromete()
        {
            var r = _repo.PreuzmiSvePromete();
            if (r == null)
            {
                return NotFound();
            }

            var response = r.Select(item =>
            {
                var netoKvadratura = item.NetoKvadraturaObjekta ?? 0;
                var prometPoKvadraturi = netoKvadratura > 0 && item.Promet.HasValue
                    ? Math.Round(item.Promet.Value / netoKvadratura, 2)
                    : 0;

                var brojZaposlenih = item.BrojZaposlenih ?? 0;
                var prometPoZaposlenom = item.PrometPoZaposlenom ?? (brojZaposlenih > 0 && item.Promet.HasValue
                    ? Math.Round(item.Promet.Value / brojZaposlenih, 2)
                    : 0);

                return new ResponsePrometiProdavnica
                {
                    BrojProdavnice = item.BrojProdavnice,
                    Regija = item.Regija,
                    Format = item.Format,
                    Adresa = item.Adresa,
                    Promet = item.Promet,
                    PrometProslaGodina = item.PrometProslaGodina,
                    BrojKupaca = item.BrojKupaca,
                    BrojKupacaProslaGodina = item.BrojKupacaProslaGodina,
                    NetoKvadraturaObjekta = netoKvadratura,
                    BrojZaposlenih = brojZaposlenih,
                    PrometPoNetoKvadraturi = prometPoKvadraturi,
                    PrometProslaGodinaPoNetoKvadraturi = item.PrometProslaGodinaPoNetoKvadraturi,
                    PrometPoUposleniku = prometPoZaposlenom,
                    PrometPoZaposlenom = prometPoZaposlenom
                };
            }).ToList();

            return Ok(response);
        }

        [HttpGet("promet-detalji")]
        public IActionResult PreuzmiPrometDetaljeZaMjesec()
        {
            var prometDetalji = _repo.PreuzmiPrometDetaljeZaMjesec();
            return Ok(prometDetalji);
        }

    }
}