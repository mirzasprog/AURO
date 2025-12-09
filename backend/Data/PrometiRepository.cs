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

        public List<PrometHistoryComparison> PreuzmiPrometDetaljeZaMjesec()
        {
            var today = DateTime.Today;
            var currentYear = today.Year;
            var currentMonth = today.Month;
            var previousYear = currentYear - 1;
            var previousMonth = currentMonth;

            var lastAvailableCurrentDay = _context.PrometiHistorija
                .Where(p => p.Godina == currentYear && p.Mjesec == currentMonth)
                .Select(p => p.Dan)
                .DefaultIfEmpty(0)
                .Max();

            lastAvailableCurrentDay = Math.Min(lastAvailableCurrentDay, DateTime.DaysInMonth(currentYear, currentMonth));

            var daysInPreviousMonth = DateTime.DaysInMonth(previousYear, previousMonth);

            var currentYearLookup = _context.PrometiHistorija
                .Where(p => p.Godina == currentYear && p.Mjesec == currentMonth && p.Dan <= lastAvailableCurrentDay)
                .AsEnumerable()
                .GroupBy(p => p.Dan)
                .ToDictionary(g => g.Key, g => g.Sum(x => x.UkupniPromet));

            var previousYearLookup = _context.PrometiHistorija
                .Where(p => p.Godina == previousYear && p.Mjesec == previousMonth)
                .AsEnumerable()
                .GroupBy(p => p.Dan)
                .ToDictionary(g => g.Key, g => g.Sum(x => x.UkupniPromet));

            var daysInCurrentMonth = DateTime.DaysInMonth(currentYear, currentMonth);
            var results = new List<PrometHistoryComparison>();

            for (var day = 1; day <= daysInPreviousMonth; day++)
            {
                currentYearLookup.TryGetValue(day, out var currentTurnover);
                previousYearLookup.TryGetValue(day, out var previousTurnover);

                var safeCurrentDay = Math.Min(day, daysInCurrentMonth);

                results.Add(new PrometHistoryComparison
                {
                    Day = day,
                    CurrentYear = currentYear,
                    PreviousYear = previousYear,
                    CurrentYearDate = new DateTime(currentYear, currentMonth, safeCurrentDay),
                    PreviousYearDate = new DateTime(previousYear, previousMonth, day),
                    CurrentYearTurnover = Math.Round(currentTurnover, 2),
                    PreviousYearTurnover = Math.Round(previousTurnover, 2)
                });
            }

            return results;
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