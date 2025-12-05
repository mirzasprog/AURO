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

            if (r != null)
            {
                r.NetoKvadraturaObjekta = DohvatiNetoKvadraturu(r.BrojProdavnice);
                r.PrometPoNetoKvadraturi = IzracunajPrometPoKvadraturi(r.Promet, r.NetoKvadraturaObjekta);
                r.PrometProslaGodinaPoNetoKvadraturi = IzracunajPrometPoKvadraturi(r.PrometProslaGodina, r.NetoKvadraturaObjekta);
            }

            return r;
        }

        public ResponsePrometiProdavnica? PreuzmiPrometeSvihProdavnica()
        {
            var r = _context.PrometiProdavnica?.FromSqlInterpolated($"EXEC GetPrometiSvihProdavnica") .AsEnumerable().FirstOrDefault();

            if (r != null)
            {
                r.NetoKvadraturaObjekta = DohvatiNetoKvadraturu(r.BrojProdavnice);
                r.PrometPoNetoKvadraturi = IzracunajPrometPoKvadraturi(r.Promet, r.NetoKvadraturaObjekta);
                r.PrometProslaGodinaPoNetoKvadraturi = IzracunajPrometPoKvadraturi(r.PrometProslaGodina, r.NetoKvadraturaObjekta);
            }

            return r;
        }

        public List<ResponsePrometiProdavnica>? PreuzmiSvePromete()
        {
            var r = _context.ResponsePrometiProdavnica?
                .FromSqlInterpolated($"EXEC GetPrometSvihProdavnica")
                .ToList();

            if (r != null)
            {
                foreach (var prodavnica in r)
                {
                    prodavnica.NetoKvadraturaObjekta = DohvatiNetoKvadraturu(prodavnica.BrojProdavnice);
                    prodavnica.PrometPoNetoKvadraturi = IzracunajPrometPoKvadraturi(prodavnica.Promet, prodavnica.NetoKvadraturaObjekta);
                    prodavnica.PrometProslaGodinaPoNetoKvadraturi = IzracunajPrometPoKvadraturi(prodavnica.PrometProslaGodina, prodavnica.NetoKvadraturaObjekta);
                }
            }

            return r;
        }

        private decimal DohvatiNetoKvadraturu(string? brojProdavnice)
        {
            var netoPovrsina = _context.NetoPovrsinaProd
                .AsNoTracking()
                .AsEnumerable()
                .FirstOrDefault(x => AreSameStore(x.BrojProdavnice, brojProdavnice))?.NetoPovrsina;

            return netoPovrsina.HasValue ? (decimal)netoPovrsina.Value : 0;
        }

        private decimal IzracunajPrometPoKvadraturi(decimal? promet, decimal? netoKvadratura)
        {
            if (!promet.HasValue)
            {
                return 0;
            }

            var kvadratura = netoKvadratura ?? 0;
            return kvadratura > 0 ? Math.Round(promet.Value / kvadratura, 2) : 0;
        }

        private static bool AreSameStore(string? left, string? right)
        {
            var normalizedLeft = NormalizeStoreId(left);
            var normalizedRight = NormalizeStoreId(right);

            return !string.IsNullOrEmpty(normalizedLeft) && normalizedLeft == normalizedRight;
        }

        private static string NormalizeStoreId(string? value)
        {
            return value?.Trim()?.TrimStart('0') ?? string.Empty;
        }

    }
}