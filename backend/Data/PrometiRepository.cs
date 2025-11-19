using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class PrometiRepository : IPrometiRepository
    {
        private readonly Auro2Context _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string? korisnickoIme;

        public PrometiRepository(Auro2Context context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            korisnickoIme = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        }

        public ResponsePrometProdavnice? PreuzmiPrometProdavnice(string prodavnica)
        {
           // string brojProdavnice = korisnickoIme ?? "";

            var r = _context.PrometProdavnice?.FromSqlInterpolated($"EXEC GetPrometi {prodavnica}") .AsEnumerable() 
        .FirstOrDefault();
            return r;
        }

        public ResponsePrometiProdavnica? PreuzmiPrometeSvihProdavnica()
        {
            var r = _context.PrometiProdavnica?.FromSqlInterpolated($"EXEC GetPrometiSvihProdavnica") .AsEnumerable().FirstOrDefault();
            return r;
        }
    }
}