using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class PDTlistaRepository : IPDTlistaRepository
    {
        private readonly Auro2Context _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string? korisnickoIme;

        public PDTlistaRepository(Auro2Context context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            korisnickoIme = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        }

        public IEnumerable<PDTdokumenti> PreuzmiPDTdokumente()
        {

            string brojProdavnice = korisnickoIme?.Length > 1
                ? korisnickoIme.Substring(1, korisnickoIme.Length - 1)
                : korisnickoIme ?? "";

            var r = _context.PDTdokumenti.FromSqlInterpolated($"EXEC GetPDTsifre {brojProdavnice}");
            return r;
        }

        public IEnumerable<PDTartikliVanrednogOtpisa> PreuzmiPDTartikleVanredniOtpis(UnosPDTvanredni podaci)
        {
            string brojProdavnice = korisnickoIme?.Length > 1
                ? korisnickoIme.Substring(1, korisnickoIme.Length - 1)
                : korisnickoIme ?? "";

            var r = _context.PDTartikliVanrednogOtpisa.FromSqlInterpolated($"EXEC GetArtikliPDTVanredniOtpis {brojProdavnice}, {podaci.BrojDokumenta}, {podaci.Razlog}, {podaci.PotrebanTransport}, {podaci.PotrebnoZbrinjavanje} ");
            return r;
        }

        public IEnumerable<PDTartikliRedovnogOtpisa> PreuzmiPDTartikleRedovniOtpis(UnosPDTredovni podaci)
        {
            string brojProdavnice = korisnickoIme?.Length > 1
                ? korisnickoIme.Substring(1, korisnickoIme.Length - 1)
                : korisnickoIme ?? "";

            var r = _context.PDTartikliRedovnogOtpisa.FromSqlInterpolated($"EXEC GetArtikliPDTRedovniOtpis {brojProdavnice}, {podaci.BrojDokumenta}, {podaci.Razlog}, {podaci.ProvedenoSnizenje} ");
            return r;
        }

        public IEnumerable<PDTIzdatnicaTroska> PreuzmiPDTartikleIzdatnice(UnosPDTIzdatnice podaci)
        {
            string brojProdavnice = korisnickoIme?.Length > 1
                ? korisnickoIme.Substring(1, korisnickoIme.Length - 1)
                : korisnickoIme ?? "";

            var r = _context.PDTizdatniceTroska.FromSqlInterpolated($"EXEC GetIzdatnicePDT {brojProdavnice}, {podaci.BrojDokumenta}, {podaci.Razlog}, {podaci.DatumIzradeIzdatnice}");
            return r;
        }
        // EDIT
         public IEnumerable<PDTNeuslovnaRoba> PreuzmiPDTartikleNeuslovneRobe(UnosPDTNeuslovneRobe podaci)
        {
            string brojProdavnice = korisnickoIme?.Length > 1
                ? korisnickoIme.Substring(1, korisnickoIme.Length - 1)
                : korisnickoIme ?? "";

            var r = _context.PDTNeuslovnaRoba.FromSqlInterpolated($"EXEC [GetPDTNeuslovneRobe] {brojProdavnice}, {podaci.BrojDokumenta}, {podaci.OtpisPovrat},{podaci.razlogNeuslovnosti},{podaci.razlogPrisustva}");
            return r;
        }


    }
}