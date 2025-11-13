using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using backend.Entities;
using backend.Models.Dashboard;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly Auro2Context _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly string? _korisnickoIme;
        private Korisnik? _currentUser;

        public DashboardRepository(Auro2Context context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _korisnickoIme = _httpContextAccessor.HttpContext?.User?.Identity?.Name;
        }

        public async Task<DashboardSummaryDto> GetDashboardSummaryAsync(int? prodavnicaId, DateTime date)
        {
            var store = await ResolveStoreAsync(prodavnicaId);
            if (store == null)
            {
                return new DashboardSummaryDto();
            }

            var storeCode = store.BrojProdavnice;
            var todayData = await _context.Tkuanalitika
                .AsNoTracking()
                .Where(t => t.Prodavnica == storeCode && t.Datum.HasValue && t.Datum.Value.Date == date.Date)
                .ToListAsync();

            var monthStart = new DateTime(date.Year, date.Month, 1);
            var monthEnd = monthStart.AddMonths(1);

            var monthData = await _context.Tkuanalitika
                .AsNoTracking()
                .Where(t => t.Prodavnica == storeCode && t.Datum.HasValue && t.Datum.Value >= monthStart && t.Datum.Value < monthEnd)
                .ToListAsync();

            var previousDay = date.AddYears(-1);
            var previousDayData = await _context.Tkuanalitika
                .AsNoTracking()
                .Where(t => t.Prodavnica == storeCode && t.Datum.HasValue && t.Datum.Value.Date == previousDay.Date)
                .ToListAsync();

            var previousMonthStart = monthStart.AddYears(-1);
            var previousMonthEnd = previousMonthStart.AddMonths(1);
            var previousMonthData = await _context.Tkuanalitika
                .AsNoTracking()
                .Where(t => t.Prodavnica == storeCode && t.Datum.HasValue && t.Datum.Value >= previousMonthStart && t.Datum.Value < previousMonthEnd)
                .ToListAsync();

            var visitorCount = todayData.Sum(t => t.Brojtransakcija ?? 0);
            var turnover = todayData.Sum(t => t.Prodajasapdv ?? 0m);
            var shrinkage = todayData.Sum(t => t.Provizija ?? 0m);
            var averageBasket = visitorCount > 0 ? turnover / visitorCount : 0m;

            var visitorsTrend = BuildDailyTrend(monthData, t => t.Brojtransakcija ?? 0, date);
            var turnoverTrend = BuildDailyTrend(monthData, t => t.Prodajasapdv ?? 0m, date);
            var averageBasketTrend = BuildAverageBasketTrend(visitorsTrend, turnoverTrend);

            var categorySummary = await BuildCategorySummaryAsync(storeCode, date);
            var dayComparison = BuildDayComparison(date, turnover, previousDay, previousDayData.Sum(t => t.Prodajasapdv ?? 0m));
            var monthComparison = BuildMonthComparison(monthStart, monthData, previousMonthStart, previousMonthData);

            return new DashboardSummaryDto
            {
                Visitors = new DashboardKpiDto
                {
                    Key = "visitors",
                    Label = "Broj posjetilaca",
                    Value = visitorCount,
                    Unit = "",
                    FormattedValue = visitorCount.ToString("N0", CultureInfo.InvariantCulture),
                    Trend = visitorsTrend
                },
                Turnover = new DashboardKpiDto
                {
                    Key = "turnover",
                    Label = "Promet",
                    Value = turnover,
                    Unit = "KM",
                    FormattedValue = turnover.ToString("N2", CultureInfo.InvariantCulture),
                    Trend = turnoverTrend
                },
                Shrinkage = new DashboardKpiDto
                {
                    Key = "shrinkage",
                    Label = "Trenutni otpis",
                    Value = shrinkage,
                    Unit = "KM",
                    FormattedValue = shrinkage.ToString("N2", CultureInfo.InvariantCulture),
                    Trend = turnoverTrend
                },
                AverageBasket = new DashboardKpiDto
                {
                    Key = "averageBasket",
                    Label = "Prosječna vrijednost korpe",
                    Value = averageBasket,
                    Unit = "KM",
                    FormattedValue = averageBasket.ToString("N2", CultureInfo.InvariantCulture),
                    Trend = averageBasketTrend
                },
                CategoryShare = categorySummary,
                DayOnDay = dayComparison,
                MonthOnMonth = monthComparison
            };
        }

        private async Task<Prodavnica?> ResolveStoreAsync(int? prodavnicaId)
        {
            if (prodavnicaId.HasValue)
            {
                return await _context.Prodavnica.AsNoTracking().FirstOrDefaultAsync(p => p.KorisnikId == prodavnicaId.Value);
            }

            if (_currentUser != null)
            {
                return _currentUser.Prodavnica;
            }

            if (string.IsNullOrWhiteSpace(_korisnickoIme))
            {
                return null;
            }

            _currentUser = await _context.Korisnik
                .Include(k => k.Prodavnica)
                .FirstOrDefaultAsync(k => k.KorisnickoIme == _korisnickoIme);

            return _currentUser?.Prodavnica;
        }

        private IReadOnlyCollection<DashboardTrendPointDto> BuildDailyTrend(IEnumerable<Tkuanalitika> data, Func<Tkuanalitika, decimal> selector, DateTime referenceDate)
        {
            return data
                .Where(t => t.Datum.HasValue)
                .GroupBy(t => t.Datum!.Value.Date)
                .OrderBy(g => g.Key)
                .Select(g => new DashboardTrendPointDto
                {
                    Date = g.Key,
                    Label = g.Key.ToString("dd.MM", CultureInfo.InvariantCulture),
                    Value = g.Sum(selector)
                })
                .ToList();
        }

        private IReadOnlyCollection<DashboardTrendPointDto> BuildAverageBasketTrend(IReadOnlyCollection<DashboardTrendPointDto> visitors, IReadOnlyCollection<DashboardTrendPointDto> turnover)
        {
            var visitorLookup = visitors.ToDictionary(v => v.Date.Date, v => v.Value);
            return turnover
                .Select(t =>
                {
                    visitorLookup.TryGetValue(t.Date.Date, out var visitorCount);
                    var value = visitorCount > 0 ? t.Value / visitorCount : 0m;
                    return new DashboardTrendPointDto
                    {
                        Date = t.Date,
                        Label = t.Label,
                        Value = value
                    };
                })
                .ToList();
        }

        private async Task<CategoryShareSummaryDto> BuildCategorySummaryAsync(string storeCode, DateTime date)
        {
            var categories = await _context.Tkusintetika
                .AsNoTracking()
                .Where(t => t.Prodavnica == storeCode && t.Datum.Date == date.Date)
                .ToListAsync();

            var categoryTotals = new Dictionary<string, decimal>(StringComparer.OrdinalIgnoreCase);
            foreach (var record in categories)
            {
                if (string.IsNullOrWhiteSpace(record.Opis))
                {
                    continue;
                }

                if (!decimal.TryParse(record.Iznosnaknadesapdv, NumberStyles.Any, CultureInfo.InvariantCulture, out var amount))
                {
                    continue;
                }

                if (!categoryTotals.TryAdd(record.Opis, amount))
                {
                    categoryTotals[record.Opis] += amount;
                }
            }

            var total = categoryTotals.Values.Sum();
            var categoryShares = categoryTotals
                .OrderByDescending(kvp => kvp.Value)
                .Select(kvp => new CategoryShareDto
                {
                    Category = kvp.Key,
                    Amount = kvp.Value,
                    Share = total > 0 ? kvp.Value / total : 0m
                })
                .ToList();

            var vipShare = categoryShares
                .Where(c => c.Category.Contains("VIP", StringComparison.OrdinalIgnoreCase))
                .Sum(c => c.Share);

            return new CategoryShareSummaryDto
            {
                VipShare = vipShare,
                Categories = categoryShares
            };
        }

        private ComparisonChartDto BuildDayComparison(DateTime currentDate, decimal currentTurnover, DateTime previousDate, decimal previousTurnover)
        {
            return new ComparisonChartDto
            {
                CurrentLabel = currentDate.ToString("dd.MM.yyyy", CultureInfo.InvariantCulture),
                PreviousLabel = previousDate.ToString("dd.MM.yyyy", CultureInfo.InvariantCulture),
                Current = new List<DashboardTrendPointDto>
                {
                    new DashboardTrendPointDto
                    {
                        Date = currentDate,
                        Label = currentDate.ToString("dd.MM", CultureInfo.InvariantCulture),
                        Value = currentTurnover
                    }
                },
                Previous = new List<DashboardTrendPointDto>
                {
                    new DashboardTrendPointDto
                    {
                        Date = previousDate,
                        Label = previousDate.ToString("dd.MM", CultureInfo.InvariantCulture),
                        Value = previousTurnover
                    }
                }
            };
        }

        private ComparisonChartDto BuildMonthComparison(DateTime currentMonthStart, IEnumerable<Tkuanalitika> currentMonthData, DateTime previousMonthStart, IEnumerable<Tkuanalitika> previousMonthData)
        {
            var currentTotals = currentMonthData
                .Where(t => t.Datum.HasValue)
                .GroupBy(t => t.Datum!.Value.Date)
                .OrderBy(g => g.Key)
                .Select(g => new DashboardTrendPointDto
                {
                    Date = g.Key,
                    Label = g.Key.ToString("dd.MM", CultureInfo.InvariantCulture),
                    Value = g.Sum(x => x.Prodajasapdv ?? 0m)
                })
                .ToList();

            var previousTotals = previousMonthData
                .Where(t => t.Datum.HasValue)
                .GroupBy(t => t.Datum!.Value.Date)
                .OrderBy(g => g.Key)
                .Select(g => new DashboardTrendPointDto
                {
                    Date = g.Key,
                    Label = g.Key.ToString("dd.MM", CultureInfo.InvariantCulture),
                    Value = g.Sum(x => x.Prodajasapdv ?? 0m)
                })
                .ToList();

            return new ComparisonChartDto
            {
                CurrentLabel = currentMonthStart.ToString("MMMM yyyy", CultureInfo.InvariantCulture),
                PreviousLabel = previousMonthStart.ToString("MMMM yyyy", CultureInfo.InvariantCulture),
                Current = currentTotals,
                Previous = previousTotals
            };
        }
    }
}
