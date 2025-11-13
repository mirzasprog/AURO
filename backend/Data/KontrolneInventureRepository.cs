using System.Data;
using backend.Entities;
using backend.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace backend.Data {
    public class KontrolneInventureRepository : IKontrolneInventureRepository
    {
        private readonly Auro2Context _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string? korisnickoIme;

        public KontrolneInventureRepository(Auro2Context context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            korisnickoIme = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        }
        public IEnumerable<KontrolneInventure> PreuzmiKontrolneInventure()
        {
            var r = _context.KontrolneInventure.FromSqlInterpolated($"EXEC GetKontrolneInventure {korisnickoIme} ");
            return r;
        }
    }
}