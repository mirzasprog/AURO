using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data {
    public class AkcijeRepository : IAkcijeRepository
    {
        private readonly Auro2Context _context;
       // public readonly int? korisnikID;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string? korisnickoIme;

        public AkcijeRepository(Auro2Context context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            korisnickoIme = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
           // korisnikID = _context.Korisnik.AsNoTracking().SingleOrDefault(k => k.KorisnickoIme == korisnickoIme)?.KorisnikId;
        }

        public IEnumerable<AkcijeZaglavljeResponse> PreuzmiAkcijeZaglavlje()
        {
            var r = _context.AkcijeZaglavljeResponse.FromSqlInterpolated($"EXEC GetAkcijeZaglavlje");
            return r;
        }

        public IEnumerable<AkcijeStavkeResponse> PreuzmiAkcijeStavke(int akcijaID)
        {
            var r = _context.AkcijeStavkeResponse.FromSqlInterpolated($"EXEC GetAkcijeStavke {akcijaID}, {korisnickoIme} ");
            return r;
        }
        
    }
}