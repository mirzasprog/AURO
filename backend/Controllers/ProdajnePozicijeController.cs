using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using backend.Entities;
using backend.Models.ProdajnePozicije;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Authorize(Roles = "podrucni,regionalni,interna,uprava")]
    [Route("api/[controller]")]
    [ApiController]
    public class ProdajnePozicijeController : ControllerBase
    {
        private readonly Auro2Context _context;

        public ProdajnePozicijeController(Auro2Context context)
        {
            _context = context;
        }

        [HttpGet("{storeId:int}")]
        public async Task<IActionResult> GetLayout(int storeId)
        {
            var layout = await _context.ProdajniLayout
                .AsNoTracking()
                .Include(l => l.Pozicije)
                .FirstOrDefaultAsync(l => l.ProdavnicaId == storeId);

            if (layout == null)
            {
                return Ok(new ProdajnePozicijeResponse());
            }

            return Ok(new ProdajnePozicijeResponse
            {
                Layout = new ProdajniLayoutDto
                {
                    Id = layout.Id,
                    ProdavnicaId = layout.ProdavnicaId,
                    Sirina = layout.Sirina,
                    Duzina = layout.Duzina,
                    BackgroundFileName = layout.BackgroundFileName,
                    BackgroundContentType = layout.BackgroundContentType,
                    BackgroundData = layout.BackgroundData
                },
                Pozicije = layout.Pozicije.Select(MapPozicija).ToList()
            });
        }

        [HttpPut("{storeId:int}")]
        public async Task<IActionResult> UpsertLayout(int storeId, [FromBody] ProdajnePozicijeUpsertRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var storeExists = await _context.Prodavnica.AnyAsync(p => p.KorisnikId == storeId);
            if (!storeExists)
            {
                return NotFound(new { poruka = "Prodavnica nije pronađena." });
            }

            var layout = await _context.ProdajniLayout
                .Include(l => l.Pozicije)
                .FirstOrDefaultAsync(l => l.ProdavnicaId == storeId);

            if (layout == null)
            {
                layout = new ProdajniLayout
                {
                    ProdavnicaId = storeId,
                    Sirina = request.Sirina,
                    Duzina = request.Duzina,
                    BackgroundFileName = request.BackgroundFileName,
                    BackgroundContentType = request.BackgroundContentType,
                    BackgroundData = request.BackgroundData,
                    DatumKreiranja = DateTime.UtcNow
                };

                _context.ProdajniLayout.Add(layout);
            }
            else
            {
                layout.Sirina = request.Sirina;
                layout.Duzina = request.Duzina;
                layout.BackgroundFileName = request.BackgroundFileName;
                layout.BackgroundContentType = request.BackgroundContentType;
                layout.BackgroundData = request.BackgroundData;
                layout.DatumIzmjene = DateTime.UtcNow;

                if (layout.Pozicije.Any())
                {
                    _context.ProdajnaPozicija.RemoveRange(layout.Pozicije);
                }
            }

            var nowePozicije = request.Pozicije.Select(pozicija => new ProdajnaPozicija
            {
                Tip = pozicija.Tip,
                Naziv = pozicija.Naziv,
                BrojPozicije = pozicija.BrojPozicije,
                Trgovac = pozicija.Trgovac,
                Trader = pozicija.Trader,
                ZakupDo = pozicija.ZakupDo,
                VrijednostZakupa = pozicija.VrijednostZakupa,
                VrstaUgovora = pozicija.VrstaUgovora,
                TipPozicije = pozicija.TipPozicije,
                Sirina = pozicija.Sirina,
                Duzina = pozicija.Duzina,
                PozicijaX = pozicija.PozicijaX,
                PozicijaY = pozicija.PozicijaY,
                Rotacija = pozicija.Rotacija,
                Zona = pozicija.Zona,
                DatumKreiranja = DateTime.UtcNow,
                Layout = layout
            }).ToList();

            if (nowePozicije.Any())
            {
                _context.ProdajnaPozicija.AddRange(nowePozicije);
            }

            await _context.SaveChangesAsync();

            return Ok(new ProdajnePozicijeResponse
            {
                Layout = new ProdajniLayoutDto
                {
                    Id = layout.Id,
                    ProdavnicaId = layout.ProdavnicaId,
                    Sirina = layout.Sirina,
                    Duzina = layout.Duzina,
                    BackgroundFileName = layout.BackgroundFileName,
                    BackgroundContentType = layout.BackgroundContentType,
                    BackgroundData = layout.BackgroundData
                },
                Pozicije = nowePozicije.Select(MapPozicija).ToList()
            });
        }

        [HttpDelete("{storeId:int}")]
        public async Task<IActionResult> DeleteLayout(int storeId)
        {
            var layout = await _context.ProdajniLayout
                .Include(l => l.Pozicije)
                .FirstOrDefaultAsync(l => l.ProdavnicaId == storeId);

            if (layout == null)
            {
                return NotFound(new { poruka = "Layout nije pronađen." });
            }

            _context.ProdajniLayout.Remove(layout);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{storeId:int}/export")]
        public async Task<IActionResult> Export(
            int storeId,
            [FromQuery] string? search = null,
            [FromQuery] string? tip = null,
            [FromQuery] string? odjel = null,
            [FromQuery] string? trgovac = null,
            [FromQuery] string? trader = null,
            [FromQuery] string? status = null,
            [FromQuery] DateTime? zakupOd = null,
            [FromQuery] DateTime? zakupDo = null)
        {
            var layout = await _context.ProdajniLayout
                .AsNoTracking()
                .Include(l => l.Pozicije)
                .Include(l => l.Prodavnica)
                .FirstOrDefaultAsync(l => l.ProdavnicaId == storeId);

            if (layout == null)
            {
                return NotFound(new { poruka = "Layout nije pronađen." });
            }

            var filteredPozicije = layout.Pozicije.AsEnumerable();
            if (!string.IsNullOrWhiteSpace(search))
            {
                var lowered = search.Trim().ToLower();
                filteredPozicije = filteredPozicije.Where(p =>
                    $"{p.BrojPozicije} {p.Naziv} {p.Trgovac} {p.Trader}".ToLower().Contains(lowered));
            }
            if (!string.IsNullOrWhiteSpace(tip))
            {
                filteredPozicije = filteredPozicije.Where(p => string.Equals(p.Tip, tip, StringComparison.OrdinalIgnoreCase));
            }
            if (!string.IsNullOrWhiteSpace(odjel))
            {
                filteredPozicije = filteredPozicije.Where(p => string.Equals(p.Zona, odjel, StringComparison.OrdinalIgnoreCase));
            }
            if (!string.IsNullOrWhiteSpace(trgovac))
            {
                filteredPozicije = filteredPozicije.Where(p =>
                    (p.Trgovac ?? string.Empty).Contains(trgovac, StringComparison.OrdinalIgnoreCase));
            }
            if (!string.IsNullOrWhiteSpace(trader))
            {
                filteredPozicije = filteredPozicije.Where(p =>
                    (p.Trader ?? string.Empty).Contains(trader, StringComparison.OrdinalIgnoreCase));
            }
            if (!string.IsNullOrWhiteSpace(status))
            {
                if (string.Equals(status, "Zauzeta", StringComparison.OrdinalIgnoreCase))
                {
                    filteredPozicije = filteredPozicije.Where(p =>
                        !string.IsNullOrWhiteSpace(p.Trgovac) || !string.IsNullOrWhiteSpace(p.Trader));
                }
                else if (string.Equals(status, "Slobodna", StringComparison.OrdinalIgnoreCase))
                {
                    filteredPozicije = filteredPozicije.Where(p =>
                        string.IsNullOrWhiteSpace(p.Trgovac) && string.IsNullOrWhiteSpace(p.Trader));
                }
            }
            if (zakupOd.HasValue)
            {
                filteredPozicije = filteredPozicije.Where(p => p.ZakupDo.HasValue && p.ZakupDo.Value.Date >= zakupOd.Value.Date);
            }
            if (zakupDo.HasValue)
            {
                filteredPozicije = filteredPozicije.Where(p => p.ZakupDo.HasValue && p.ZakupDo.Value.Date <= zakupDo.Value.Date);
            }

            var pozicijeZaIzvjestaj = filteredPozicije.ToList();
            var ukupno = layout.Sirina * layout.Duzina;
            var zauzeto = pozicijeZaIzvjestaj.Sum(p => p.Sirina * p.Duzina);
            var slobodno = ukupno - zauzeto;
            var iskoristenost = ukupno > 0 ? Math.Round((double)(zauzeto / ukupno) * 100, 2) : 0;

            using var workbook = new XLWorkbook();
            var summary = workbook.AddWorksheet("Summary");
            var storeLabel = layout.Prodavnica != null
                ? $"{layout.Prodavnica.BrojProdavnice} - {layout.Prodavnica.Mjesto}"
                : storeId.ToString();

            summary.Cell(1, 1).Value = "Prodavnica";
            summary.Cell(1, 2).Value = storeLabel;
            summary.Cell(2, 1).Value = "Ukupna površina";
            summary.Cell(2, 2).Value = ukupno;
            summary.Cell(3, 1).Value = "Zauzeta površina";
            summary.Cell(3, 2).Value = zauzeto;
            summary.Cell(4, 1).Value = "Slobodna površina";
            summary.Cell(4, 2).Value = slobodno;
            summary.Cell(5, 1).Value = "Iskorištenost (%)";
            summary.Cell(5, 2).Value = iskoristenost;

            var pozicijeSheet = workbook.AddWorksheet("Pozicije");
            pozicijeSheet.Cell(1, 1).Value = "Tip";
            pozicijeSheet.Cell(1, 2).Value = "Naziv";
            pozicijeSheet.Cell(1, 3).Value = "Broj pozicije";
            pozicijeSheet.Cell(1, 4).Value = "Trader";
            pozicijeSheet.Cell(1, 5).Value = "Širina";
            pozicijeSheet.Cell(1, 6).Value = "Dužina";
            pozicijeSheet.Cell(1, 7).Value = "X";
            pozicijeSheet.Cell(1, 8).Value = "Y";
            pozicijeSheet.Cell(1, 9).Value = "Rotacija";
            pozicijeSheet.Cell(1, 10).Value = "Zona";
            pozicijeSheet.Cell(1, 11).Value = "Površina";

            var row = 2;
            foreach (var pozicija in pozicijeZaIzvjestaj.OrderBy(p => p.Tip).ThenBy(p => p.Naziv))
            {
                pozicijeSheet.Cell(row, 1).Value = pozicija.Tip;
                pozicijeSheet.Cell(row, 2).Value = pozicija.Naziv;
                pozicijeSheet.Cell(row, 3).Value = pozicija.BrojPozicije;
                pozicijeSheet.Cell(row, 4).Value = pozicija.Trader;
                pozicijeSheet.Cell(row, 5).Value = pozicija.Sirina;
                pozicijeSheet.Cell(row, 6).Value = pozicija.Duzina;
                pozicijeSheet.Cell(row, 7).Value = pozicija.PozicijaX;
                pozicijeSheet.Cell(row, 8).Value = pozicija.PozicijaY;
                pozicijeSheet.Cell(row, 9).Value = pozicija.Rotacija;
                pozicijeSheet.Cell(row, 10).Value = pozicija.Zona;
                pozicijeSheet.Cell(row, 11).Value = pozicija.Sirina * pozicija.Duzina;
                row++;
            }

            var agregacijaSheet = workbook.AddWorksheet("Agregacija");
            agregacijaSheet.Cell(1, 1).Value = "Tip";
            agregacijaSheet.Cell(1, 2).Value = "Broj objekata";
            agregacijaSheet.Cell(1, 3).Value = "Zauzeta površina";
            agregacijaSheet.Cell(1, 4).Value = "Učešće (%)";

            row = 2;
            foreach (var grupa in pozicijeZaIzvjestaj.GroupBy(p => p.Tip).OrderBy(g => g.Key))
            {
                var povrsina = grupa.Sum(p => p.Sirina * p.Duzina);
                var ucesce = ukupno > 0 ? Math.Round((double)(povrsina / ukupno) * 100, 2) : 0;
                agregacijaSheet.Cell(row, 1).Value = grupa.Key;
                agregacijaSheet.Cell(row, 2).Value = grupa.Count();
                agregacijaSheet.Cell(row, 3).Value = povrsina;
                agregacijaSheet.Cell(row, 4).Value = ucesce;
                row++;
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;

            var fileName = BuildFileName(storeLabel);
            return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }

        private static string BuildFileName(string storeLabel)
        {
            var safeStore = new string(storeLabel
                .Select(ch => Path.GetInvalidFileNameChars().Contains(ch) ? '_' : ch)
                .ToArray());
            return $"ProdajnePozicije_{safeStore}_{DateTime.Now:yyyyMMdd}.xlsx";
        }

        private static ProdajnaPozicijaDto MapPozicija(ProdajnaPozicija pozicija)
        {
            return new ProdajnaPozicijaDto
            {
                Id = pozicija.Id,
                Tip = pozicija.Tip,
                Naziv = pozicija.Naziv,
                BrojPozicije = pozicija.BrojPozicije,
                Trgovac = pozicija.Trgovac,
                Trader = pozicija.Trader,
                ZakupDo = pozicija.ZakupDo,
                VrijednostZakupa = pozicija.VrijednostZakupa,
                VrstaUgovora = pozicija.VrstaUgovora,
                TipPozicije = pozicija.TipPozicije,
                Sirina = pozicija.Sirina,
                Duzina = pozicija.Duzina,
                PozicijaX = pozicija.PozicijaX,
                PozicijaY = pozicija.PozicijaY,
                Rotacija = pozicija.Rotacija,
                Zona = pozicija.Zona
            };
        }
    }
}
