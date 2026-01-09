using backend.Entities;
using Microsoft.EntityFrameworkCore;
using backend.Models;


namespace backend.Repositories
{
    public class NarucenoIsporucenoRepository : INarucenoIsporucenoRepository
    {

        private readonly Auro2Context _context;
        public NarucenoIsporucenoRepository(Auro2Context context)
        {
            _context = context;
        }

        public async Task<IEnumerable<NarucenoIsporucenoResponse>> GetAllAsync()
        {
            return await _context.NarucenoIsporuceno
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<NarucenoIsporucenoResponse?> GetByNarudzbaAsync(string narudzba)
        {
            return await _context.NarucenoIsporuceno
                .AsNoTracking()
                .FirstOrDefaultAsync(n => n.Narudzba == narudzba);
        }

        public async Task<IEnumerable<NarucenoIsporucenoResponse>> GetByProdavnicaAsync(string prodavnica)
        {
            return await _context.NarucenoIsporuceno
                .AsNoTracking()
                .Where(n => n.Prodavnica == prodavnica)
                .ToListAsync();
        }

        public async Task<IEnumerable<NarucenoIsporucenoResponse>> GetByDobavljacAsync(string sifraDobavljaca)
        {
            return await _context.NarucenoIsporuceno
                .AsNoTracking()
                .Where(n => n.SifraDobavljaca == sifraDobavljaca)
                .ToListAsync();
        }

        public async Task<IEnumerable<NarucenoIsporucenoResponse>> GetByDateRangeAsync(DateTime fromDate, DateTime toDate)
        {
            return await _context.NarucenoIsporuceno
                .AsNoTracking()
                .Where(n => n.DatumNarudzbe >= fromDate && n.DatumNarudzbe <= toDate)
                .OrderBy(n => n.DatumNarudzbe)
                .ToListAsync();
        }
    }
}