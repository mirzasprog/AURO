using backend.Entities;
using backend.Models;
using backend.Models.Prometi;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

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
                r.PodrucniVoditelj ??= DohvatiPodrucnogVoditelja(r.BrojProdavnice);
                r.NetoKvadraturaObjekta = DohvatiNetoKvadraturu(r.BrojProdavnice);
                r.BrojZaposlenih = DohvatiBrojZaposlenih(r.BrojProdavnice);
                r.PrometPoNetoKvadraturi = IzracunajPrometPoKvadraturi(r.Promet, r.NetoKvadraturaObjekta);
                r.PrometProslaGodinaPoNetoKvadraturi = IzracunajPrometPoKvadraturi(r.PrometProslaGodina, r.NetoKvadraturaObjekta);
                r.PrometPoZaposlenom = IzracunajPrometPoZaposlenom(r.Promet, r.BrojZaposlenih);
                r.PrometPoUposleniku = r.PrometPoZaposlenom;
            }

            return r;
        }

        public ResponsePrometiProdavnica? PreuzmiPrometeSvihProdavnica()
        {
            var r = _context.PrometiProdavnica?.FromSqlInterpolated($"EXEC GetPrometiSvihProdavnica") .AsEnumerable().FirstOrDefault();

            if (r != null)
            {
                r.PodrucniVoditelj ??= DohvatiPodrucnogVoditelja(r.BrojProdavnice);
                r.NetoKvadraturaObjekta = DohvatiNetoKvadraturu(r.BrojProdavnice);
                r.BrojZaposlenih = DohvatiBrojZaposlenih(r.BrojProdavnice);
                r.PrometPoNetoKvadraturi = IzracunajPrometPoKvadraturi(r.Promet, r.NetoKvadraturaObjekta);
                r.PrometProslaGodinaPoNetoKvadraturi = IzracunajPrometPoKvadraturi(r.PrometProslaGodina, r.NetoKvadraturaObjekta);
                r.PrometPoZaposlenom = IzracunajPrometPoZaposlenom(r.Promet, r.BrojZaposlenih);
                r.PrometPoUposleniku = r.PrometPoZaposlenom;
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
                var podrucniVoditelji = DohvatiPodrucneVoditelje();
                foreach (var prodavnica in r)
                {
                    prodavnica.PodrucniVoditelj ??= DohvatiPodrucnogVoditelja(prodavnica.BrojProdavnice, podrucniVoditelji);
                    prodavnica.NetoKvadraturaObjekta = DohvatiNetoKvadraturu(prodavnica.BrojProdavnice);
                    prodavnica.BrojZaposlenih = DohvatiBrojZaposlenih(prodavnica.BrojProdavnice);
                    prodavnica.PrometPoNetoKvadraturi = IzracunajPrometPoKvadraturi(prodavnica.Promet, prodavnica.NetoKvadraturaObjekta);
                    prodavnica.PrometProslaGodinaPoNetoKvadraturi = IzracunajPrometPoKvadraturi(prodavnica.PrometProslaGodina, prodavnica.NetoKvadraturaObjekta);
                    prodavnica.PrometPoZaposlenom = IzracunajPrometPoZaposlenom(prodavnica.Promet, prodavnica.BrojZaposlenih);
                    prodavnica.PrometPoUposleniku = prodavnica.PrometPoZaposlenom;
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
                .Select(p => (int?)p.Dan)
                .Max() ?? 0;

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

        public PrometRangeResponse PreuzmiPrometePoOpsegu(DateTime currentStart, DateTime currentEnd, DateTime previousStart, DateTime previousEnd)
        {
            currentStart = currentStart.Date;
            currentEnd = currentEnd.Date;
            previousStart = previousStart.Date;
            previousEnd = previousEnd.Date;

            var today = DateTime.Today;
            var storeMetadata = DohvatiStoreMetapodatke();

            var currentEntries = UcitajHistoriju(currentStart, currentEnd);

            if (currentStart <= today && today <= currentEnd)
            {
                var todayEntries = _context.ResponsePrometiProdavnica
                    .FromSqlInterpolated($"EXEC GetPrometSvihProdavnica")
                    .AsNoTracking()
                    .ToList()
                    .Select(p => new PrometRangeEntry
                    {
                        BrojProdavnice = p.BrojProdavnice,
                        Datum = today,
                        Promet = p.Promet ?? 0,
                        BrojKupaca = p.BrojKupaca ?? 0
                    })
                    .ToList();

                currentEntries = currentEntries
                    .Where(e => e.Datum.Date != today || !todayEntries.Any(t => AreSameStore(t.BrojProdavnice, e.BrojProdavnice)))
                    .Concat(todayEntries)
                    .ToList();
            }

            var previousEntries = UcitajHistoriju(previousStart, previousEnd);

            var allStoreIds = currentEntries.Select(e => e.BrojProdavnice)
                .Concat(previousEntries.Select(e => e.BrojProdavnice))
                .Where(id => !string.IsNullOrWhiteSpace(id))
                .Select(NormalizeStoreId)
                .Distinct()
                .ToList();

            var stores = allStoreIds
                .Select(id =>
                {
                    var current = currentEntries.Where(e => AreSameStore(e.BrojProdavnice, id));
                    var previous = previousEntries.Where(e => AreSameStore(e.BrojProdavnice, id));

                    var hasMeta = storeMetadata.TryGetValue(id, out var meta);

                    return new PrometRangeStoreRow
                    {
                        BrojProdavnice = hasMeta ? meta?.BrojProdavnice ?? id : id,
                        Adresa = meta?.Adresa,
                        Format = meta?.Format,
                        Regija = meta?.Regija,
                        Promet = current.Sum(e => e.Promet),
                        PrometProslaGodina = previous.Sum(e => e.Promet),
                        BrojKupaca = current.Sum(e => e.BrojKupaca),
                        BrojKupacaProslaGodina = previous.Sum(e => e.BrojKupaca)
                    };
                })
                .OrderBy(s => s.BrojProdavnice)
                .ToList();

            var currentDays = currentEntries
                .GroupBy(e => e.Datum.Date)
                .OrderBy(g => g.Key)
                .Select(g => new PrometRangeDayRow
                {
                    Datum = g.Key,
                    Promet = g.Sum(e => e.Promet),
                    PrometProslaGodina = 0,
                    BrojKupaca = g.Sum(e => e.BrojKupaca),
                    BrojKupacaProslaGodina = 0
                })
                .ToList();

            var previousDays = previousEntries
                .GroupBy(e => e.Datum.Date)
                .OrderBy(g => g.Key)
                .Select(g => new PrometRangeDayRow
                {
                    Datum = g.Key,
                    Promet = 0,
                    PrometProslaGodina = g.Sum(e => e.Promet),
                    BrojKupaca = 0,
                    BrojKupacaProslaGodina = g.Sum(e => e.BrojKupaca)
                })
                .ToList();

            var mergedDates = currentDays.Select(d => d.Datum)
                .Concat(previousDays.Select(d => d.Datum))
                .Distinct()
                .OrderBy(d => d)
                .ToList();

            var days = mergedDates.Select(datum =>
            {
                var current = currentDays.FirstOrDefault(d => d.Datum == datum);
                var previous = previousDays.FirstOrDefault(d => d.Datum == datum);

                return new PrometRangeDayRow
                {
                    Datum = datum,
                    Promet = current?.Promet ?? 0,
                    PrometProslaGodina = previous?.PrometProslaGodina ?? previous?.Promet ?? 0,
                    BrojKupaca = current?.BrojKupaca ?? 0,
                    BrojKupacaProslaGodina = previous?.BrojKupacaProslaGodina ?? previous?.BrojKupaca ?? 0
                };
            }).ToList();

            var totals = new PrometRangeSummary
            {
                Promet = currentEntries.Sum(e => e.Promet),
                PrometProslaGodina = previousEntries.Sum(e => e.Promet),
                BrojKupaca = currentEntries.Sum(e => e.BrojKupaca),
                BrojKupacaProslaGodina = previousEntries.Sum(e => e.BrojKupaca)
            };

            return new PrometRangeResponse
            {
                CurrentRange = new DateRangeDescriptor { StartDate = currentStart, EndDate = currentEnd },
                PreviousRange = new DateRangeDescriptor { StartDate = previousStart, EndDate = previousEnd },
                Totals = totals,
                Stores = stores,
                Days = days,
                CurrentDays = currentDays,
                PreviousDays = previousDays
            };
        }

        private List<PrometRangeEntry> UcitajHistoriju(DateTime start, DateTime end)
        {
            return _context.PrometiHistorija
                .AsNoTracking()
                .Where(p => p.Datum >= start && p.Datum <= end)
                .Select(p => new PrometRangeEntry
                {
                    BrojProdavnice = p.BrojProdavnice,
                    Datum = p.Datum,
                    Promet = p.UkupniPromet,
                    BrojKupaca = p.BrojKupaca ?? 0
                })
                .ToList();
        }

        private Dictionary<string, PrometRangeStoreRow> DohvatiStoreMetapodatke()
        {
            return _context.PrometiProdavnica
                .FromSqlInterpolated($"EXEC GetPrometiSvihProdavnica")
                .AsNoTracking()
                .ToList()
                .GroupBy(p => NormalizeStoreId(p.BrojProdavnice))
                .Where(g => !string.IsNullOrWhiteSpace(g.Key))
                .ToDictionary(g => g.Key, g =>
                {
                    var first = g.First();
                    return new PrometRangeStoreRow
                    {
                        BrojProdavnice = first.BrojProdavnice,
                        Adresa = first.Adresa,
                        Format = first.Format,
                        Regija = first.Regija,
                    };
                });
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

        private decimal DohvatiBrojZaposlenih(string? brojProdavnice)
        {
            var brojZaposlenih = _context.ZaposleniPoProdavnicama
                .AsNoTracking()
                .AsEnumerable()
                .FirstOrDefault(x => AreSameStore(x.BrojProdavnice, brojProdavnice))?.BrojZaposlenih;

            return brojZaposlenih.HasValue ? brojZaposlenih.Value : 0;
        }

        private string DohvatiPodrucnogVoditelja(string? brojProdavnice, Dictionary<string, string>? lookup = null)
        {
            var normalizedId = NormalizeStoreId(brojProdavnice);
            if (string.IsNullOrWhiteSpace(normalizedId))
            {
                return "-";
            }

            if (lookup != null && lookup.TryGetValue(normalizedId, out var cached))
            {
                return cached;
            }

            var localLookup = DohvatiPodrucneVoditelje();
            return localLookup.TryGetValue(normalizedId, out var voditelj) ? voditelj : "-";
        }

        private Dictionary<string, string> DohvatiPodrucneVoditelje()
        {
            return _context.ParcijalnaInventuraImportZaposlenika
                .AsNoTracking()
                .AsEnumerable()
                .Select(z => new
                {
                    BrojProdavnice = NormalizeStoreId(IzvuciBrojProdavnice(z.OznakaOJ)),
                    Voditelj = z.PodrucniVoditelj
                })
                .Where(x => !string.IsNullOrWhiteSpace(x.BrojProdavnice))
                .GroupBy(x => x.BrojProdavnice)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(x => x.Voditelj).FirstOrDefault(v => !string.IsNullOrWhiteSpace(v)) ?? "-"
                );
        }

        private static string? IzvuciBrojProdavnice(string? oznakaOj)
        {
            if (string.IsNullOrWhiteSpace(oznakaOj))
            {
                return string.Empty;
            }

            var trimmed = oznakaOj.Trim();
            return trimmed.Length <= 3 ? trimmed : trimmed.Substring(trimmed.Length - 3);
        }

        private decimal IzracunajPrometPoZaposlenom(decimal? promet, decimal? brojZaposlenih)
        {
            if (!promet.HasValue)
            {
                return 0;
            }

            var zaposleni = brojZaposlenih ?? 0;
            return zaposleni > 0 ? Math.Round(promet.Value / zaposleni, 2) : 0;
        }

        private class PrometRangeEntry
        {
            public string? BrojProdavnice { get; set; }
            public DateTime Datum { get; set; }
            public decimal Promet { get; set; }
            public int BrojKupaca { get; set; }
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


        public async Task<IEnumerable<KategorijaPrometResponse>> GetPrometProdavnicePoKategorijiAsync(string brojProdavnice)
        {
            // FromSqlInterpolated parametrizira input i izvršava stored proceduru
            var result = await _context.PrometPoKategoriji
                .FromSqlInterpolated($"EXEC Prometi.PrometProdavnicePoKategoriji @brojProdavnice = {brojProdavnice}")
                .AsNoTracking()
                .ToListAsync();

            return result;
        }

        public async Task<IEnumerable<ArtikliNaRacunuResponse>> GetArtikliNaRacunuPoKategorijiAsync(string brojProdavnice, string kategorija)
        {
            var result = await _context.ArtikliNaRacunu
                .FromSqlInterpolated($"EXEC Prometi.ArtikliNaRacunuPoKategoriji @brojProdavnice = {brojProdavnice}, @kategorija = {kategorija}")
                .AsNoTracking()
                .ToListAsync();

            return result;
        }

        

    }
}
