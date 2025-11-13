using backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Models;
using backend.Entities;

namespace Auro.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly Auro2Context _context;
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;

        public AuthController(IAuthRepository repo, Auro2Context context, IConfiguration config)
        {
            _context = context;
            _repo = repo;
            _config = config;
        }

        [HttpPost("login")]
        public ActionResult Prijava(PrijavljeniKorisnik korisnik)
        {
            bool uspjesnaPrijava = _repo.Prijava(korisnik.KorisnickoIme.ToLower(), korisnik.Lozinka, _config.GetSection("AppSettings:EnkripcijskiKljuc").Value);

            if (!uspjesnaPrijava)
                return BadRequest(new { poruka = "Pogrešno korisničko ime ili lozinka" });

            var prijavljeniKorisnik = _context.Korisnik.AsNoTracking().First(k => k.KorisnickoIme == korisnik.KorisnickoIme);
            string imePrezime = korisnik.KorisnickoIme;

            // if (prijavljeniKorisnik.Ime != null)
            // imePrezime = prijavljeniKorisnik.Ime + ' ' + prijavljeniKorisnik.Prezime;

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, prijavljeniKorisnik.KorisnickoIme),
                new Claim(ClaimTypes.Role, prijavljeniKorisnik.Uloga)
            };

            var kljuc = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(kljuc, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddHours(8),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                imePrezime
            });
        }
    }
}