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

    }
}