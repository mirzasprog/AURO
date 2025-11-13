using backend.Entities;
using Microsoft.EntityFrameworkCore;


namespace backend.Data
{
    public class UploadRepository : IUploadRepository
    {
        private readonly Auro2Context _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string? korisnickoIme;
        public readonly int? korisnikID;

        public UploadRepository(Auro2Context context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            korisnickoIme = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
            // k => k.Aktivan == true && 
            korisnikID = _context.Korisnik.AsNoTracking().SingleOrDefault(k => k.KorisnickoIme == korisnickoIme)?.KorisnikId;
        }

        public int SpremiUbazu(string putanjaFajla) {
            var r = _context.Database.ExecuteSqlInterpolated($"EXEC ImportExcelParcijalnaInventura {putanjaFajla}");
            return r;
        }
    }
}