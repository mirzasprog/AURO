using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using ExcelDataReader;
using Microsoft.AspNetCore.Http;

namespace backend.Data
{
    public class VikendAkcijeRepository : IVikendAkcijeRepository
    {
        private readonly Auro2Context _context;

        public VikendAkcijeRepository(Auro2Context context)
        {
            _context = context;
        }

        public async Task<IEnumerable<VikendAkcijaDto>> GetAkcijeAsync()
        {
            var trenutniDatum = DateTime.Now;

            return await _context.VipZaglavljes
                .AsNoTracking()
                .OrderByDescending(z => z.Pocetak)
                .Select(z => new VikendAkcijaDto
                {
                    Id = z.Id,
                    Opis = z.Opis,
                    Pocetak = z.Pocetak,
                    Kraj = z.Kraj,
                    Status = IzracunajStatus(z.Pocetak, z.Kraj, trenutniDatum),
                    BrojStavki = z.VipStavkes.Count,
                    UniqueId = z.UniqueId,
                    Produzeno = z.Produzeno
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<VikendAkcijaStavkaDto>> GetStavkeAsync(string vikendAkcijaId)
        {
            var zaglavljeId = await _context.VipZaglavljes
                .Where(z => z.UniqueId == vikendAkcijaId)
                .Select(z => z.Id)
                .FirstOrDefaultAsync();

            if (zaglavljeId == 0)
            {
                return Enumerable.Empty<VikendAkcijaStavkaDto>();
            }

            var artikli = await _context.VipArtiklis
                .AsNoTracking()
                .Where(a => a.Idakcije == vikendAkcijaId)
                .ToListAsync();

            var artikliMapa = artikli
                .Where(a => !string.IsNullOrWhiteSpace(a.SifraArtk))
                .GroupBy(a => a.SifraArtk!.Trim(), StringComparer.OrdinalIgnoreCase)
                .ToDictionary(g => g.Key, g => g.First(), StringComparer.OrdinalIgnoreCase);

            var stavke = await _context.VipStavkes
                .AsNoTracking()
                .Where(s => s.VipZaglavljeId == zaglavljeId)
                .OrderBy(s => s.SifraArtikla)
                .Select(s => new { Stavka = s, ArtikalKey = s.SifraArtikla })
                .ToListAsync();

            var agregiraneStavke = new Dictionary<string, VikendAkcijaStavkaDto>(StringComparer.OrdinalIgnoreCase);

            foreach (var zapis in stavke)
            {
                artikliMapa.TryGetValue((zapis.ArtikalKey ?? string.Empty).Trim(), out var artikal);
                var kljuc = KreirajStavkaKljuc(zapis.Stavka, artikal);

                if (!agregiraneStavke.TryGetValue(kljuc, out var dto))
                {
                    dto = MapirajStavku(zapis.Stavka, artikal);
                    dto.Kolicina = 0;
                    dto.Prodavnica = (zapis.Stavka.Prodavnica ?? string.Empty).Trim();
                    agregiraneStavke[kljuc] = dto;
                }

                dto.Kolicina += zapis.Stavka.Kolicina;
            }

            var rezultat = agregiraneStavke.Values.ToList();

            var postojeciKljuc = new HashSet<string>(rezultat
                .Select(r => NormalizujSifru(r.Sifra)), StringComparer.OrdinalIgnoreCase);

            foreach (var artikal in artikli)
            {
                var kljuc = NormalizujSifru(artikal.SifraArtk);
                if (postojeciKljuc.Contains(kljuc))
                {
                    continue;
                }

                rezultat.Add(MapirajArtikal(artikal));
                postojeciKljuc.Add(kljuc);
            }

            return rezultat
                .OrderBy(r => r.Sifra ?? r.Naziv)
                .ThenBy(r => r.Prodavnica)
                .ToList();
        }

        public async Task<IEnumerable<VipArtikalDto>> GetVipArtikliAsync(string akcijaId)
        {
            return await _context.VipArtiklis
                .AsNoTracking()
                .Where(a => a.Idakcije == akcijaId)
                .OrderBy(a => a.NazivArtk)
                .Select(a => new VipArtikalDto
                {
                    Id = a.Id,
                    IdAkcije = a.Idakcije,
                    NazivArtk = a.NazivArtk,
                    SifraArtk = a.SifraArtk,
                    BarKod = a.BarKod,
                    Dobavljac = a.Dobavljac,
                    AsSa = a.AsSa,
                    AsMo = a.AsMo,
                    AsBl = a.AsBl,
                    Opis = a.Opis,
                    Status = a.Status,
                    AkcijskaMpc = a.AkcijskaMpc,
                    Zaliha = a.Zaliha
                })
                .ToListAsync();
        }

        public async Task<VikendAkcijaStavkeUpdateResult> UpdateStavkeAsync(string vikendAkcijaId, IEnumerable<VikendAkcijaStavkaUpdate> izmjene)
        {
            var izmjeneLista = izmjene.ToList();
            var rezultat = new VikendAkcijaStavkeUpdateResult { AkcijaPronadjena = true };

            if (!izmjeneLista.Any())
            {
                return rezultat;
            }

            var zaglavljeId = await _context.VipZaglavljes
                .Where(z => z.UniqueId == vikendAkcijaId)
                .Select(z => z.Id)
                .FirstOrDefaultAsync();

            if (zaglavljeId == 0)
            {
                rezultat.AkcijaPronadjena = false;
                return rezultat;
            }

            var validneIzmjene = izmjeneLista
                .Where(i => !string.IsNullOrWhiteSpace(i.SifraArtikla))
                .Select(i => new
                {
                    Sifra = i.SifraArtikla.Trim(),
                    Kolicina = i.Kolicina,
                    Naziv = i.NazivArtikla?.Trim(),
                    Prodavnica = i.BrojProdavnice?.Trim(),
                    Komentar = NormalizujKomentar(i.Komentar)
                })
                .ToList();

            if (!validneIzmjene.Any())
            {
                return rezultat;
            }

            var sifreArtikala = validneIzmjene
                .Select(i => i.Sifra)
                .Distinct()
                .ToList();

            var stavke = await _context.VipStavkes
                .Where(s => s.VipZaglavljeId == zaglavljeId
                    && s.SifraArtikla != null
                    && sifreArtikala.Contains(s.SifraArtikla.Trim()))
                .ToListAsync();

            foreach (var izmjena in validneIzmjene)
            {
                var postojecaStavka = stavke.FirstOrDefault(s =>
                    string.Equals(s.SifraArtikla?.Trim(), izmjena.Sifra, StringComparison.OrdinalIgnoreCase)
                    && (string.IsNullOrEmpty(izmjena.Prodavnica)
                        || string.Equals(s.Prodavnica, izmjena.Prodavnica, StringComparison.OrdinalIgnoreCase)));

                if (postojecaStavka != null)
                {
                    postojecaStavka.Kolicina = izmjena.Kolicina;
                    postojecaStavka.VrijemeUnosaIzProdavnice = DateTime.UtcNow;
                    postojecaStavka.Komentar = izmjena.Komentar;
                    if (!string.IsNullOrWhiteSpace(izmjena.Naziv))
                    {
                        postojecaStavka.NazivArtikla = izmjena.Naziv;
                    }
                    if (!string.IsNullOrWhiteSpace(izmjena.Prodavnica))
                    {
                        postojecaStavka.Prodavnica = izmjena.Prodavnica;
                    }

                    rezultat.BrojAzuriranih++;
                }
                else
                {
                    _context.VipStavkes.Add(new VipStavke
                    {
                        SifraArtikla = izmjena.Sifra,
                        NazivArtikla = izmjena.Naziv,
                        Kolicina = izmjena.Kolicina,
                        Prodavnica = izmjena.Prodavnica,
                        Komentar = izmjena.Komentar,
                        VipZaglavljeId = zaglavljeId,
                        VrijemeUnosaIzProdavnice = DateTime.UtcNow
                    });

                    rezultat.BrojDodanih++;
                }
            }

            await _context.SaveChangesAsync();

            return rezultat;
        }

        public async Task<VikendAkcijaProduzenjeResult> ProduziAkcijuAsync(string vikendAkcijaId, int brojSati)
        {
            var rezultat = new VikendAkcijaProduzenjeResult { AkcijaPronadjena = true };

            if (brojSati <= 0)
            {
                rezultat.Poruka = "Broj sati mora biti veći od nule.";
                return rezultat;
            }

            var zaglavlje = await _context.VipZaglavljes
                .FirstOrDefaultAsync(z => z.UniqueId == vikendAkcijaId);

            if (zaglavlje == null)
            {
                rezultat.AkcijaPronadjena = false;
                rezultat.Poruka = "Vikend akcija nije pronađena.";
                return rezultat;
            }

            if (zaglavlje.Produzeno)
            {
                rezultat.Poruka = "Akcija je već produžena.";
                rezultat.Akcija = MapirajAkciju(zaglavlje);
                return rezultat;
            }

            var sada = DateTime.Now;
            if (zaglavlje.Kraj.Date != sada.Date)
            {
                rezultat.Poruka = "Akciju je moguće produžiti samo na posljednji dan trajanja.";
                rezultat.Akcija = MapirajAkciju(zaglavlje);
                return rezultat;
            }

            if (zaglavlje.Kraj >= sada)
            {
                rezultat.Poruka = "Akcija još uvijek nije istekla.";
                rezultat.Akcija = MapirajAkciju(zaglavlje);
                return rezultat;
            }

            zaglavlje.Kraj = zaglavlje.Kraj.AddHours(brojSati);
            zaglavlje.Produzeno = true;
            zaglavlje.Status = IzracunajStatus(zaglavlje.Pocetak, zaglavlje.Kraj, DateTime.Now);

            await _context.SaveChangesAsync();

            rezultat.Produzeno = true;
            rezultat.Poruka = "Akcija je produžena.";
            rezultat.Akcija = MapirajAkciju(zaglavlje);
            return rezultat;
        }

        public async Task<VikendAkcijaDto> KreirajAkcijuAsync(VikendAkcijaCreateRequest zahtjev)
        {
            var uniqueId = GenerisiId();
            var status = IzracunajStatus(zahtjev.Pocetak, zahtjev.Kraj);
            var zaglavlje = new VipZaglavlje
            {
                Opis = zahtjev.Opis,
                Pocetak = zahtjev.Pocetak,
                Kraj = zahtjev.Kraj,
                Status = status,
                UniqueId = uniqueId,
                Produzeno = false
            };

            _context.VipZaglavljes.Add(zaglavlje);
            await _context.SaveChangesAsync();

            return new VikendAkcijaDto
            {
                Id = zaglavlje.Id,
                Opis = zaglavlje.Opis,
                Pocetak = zaglavlje.Pocetak,
                Kraj = zaglavlje.Kraj,
                Status = zaglavlje.Status,
                BrojStavki = 0,
                UniqueId = zaglavlje.UniqueId,
                Produzeno = zaglavlje.Produzeno
            };
        }

        public async Task<VikendAkcijaImportResult> ImportArtikalaAsync(string akcijaId, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("Fajl za import nije ispravan.");
            }

            var zaglavlje = await _context.VipZaglavljes.FirstOrDefaultAsync(z => z.UniqueId == akcijaId);
            if (zaglavlje == null)
            {
                throw new InvalidOperationException("Akcija sa zadanim ID-jem nije pronađena.");
            }

            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);

            var uneseniRedovi = new List<VipArtikli>();
            var greske = new List<string>();
            var obavezneKolone = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                ["SIFRAARTIKLA"] = "ŠIFRA ARTIKLA",
                ["NAZIV"] = "NAZIV",
                ["BARKOD"] = "BAR KOD",
                ["DOBAVLJAC"] = "DOBAVLJAČ",
                ["ASSA"] = "AS SA",
                ["ASMO"] = "AS MO",
                ["ASBL"] = "AS BL",
                ["OPIS"] = "OPIS",
                ["STATUS"] = "STATUS",
                ["AKCIJSKAMPC"] = "AKCIJSKA MPC"
            };

            var postojeceSifre = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            using (var stream = file.OpenReadStream())
            using (var reader = ExcelReaderFactory.CreateReader(stream))
            {
                var dataSet = reader.AsDataSet(new ExcelDataSetConfiguration
                {
                    ConfigureDataTable = _ => new ExcelDataTableConfiguration
                    {
                        UseHeaderRow = true
                    }
                });

                if (dataSet.Tables.Count == 0)
                {
                    throw new InvalidOperationException("Excel fajl ne sadrži podatke.");
                }

                var table = dataSet.Tables[0];
                var koloneMapa = table.Columns
                    .Cast<System.Data.DataColumn>()
                    .ToDictionary(c => NormalizujKolonu(c.ColumnName), c => c.Ordinal, StringComparer.OrdinalIgnoreCase);

                var nedostajuKolone = obavezneKolone
                    .Where(k => !koloneMapa.ContainsKey(k.Key))
                    .Select(k => k.Value)
                    .ToList();

                if (nedostajuKolone.Any())
                {
                    throw new InvalidOperationException($"Excel fajl ne sadrži sve obavezne kolone: {string.Join(", ", nedostajuKolone)}.");
                }

                for (var i = 0; i < table.Rows.Count; i++)
                {
                    var row = table.Rows[i];
                    var redniBroj = i + 2; // zbog header-a
                    var rowErrors = new List<string>();

                    var sifra = ProcitajTekst(row, koloneMapa, "SIFRAARTIKLA");
                    var naziv = ProcitajTekst(row, koloneMapa, "NAZIV");
                    var barKod = ProcitajTekst(row, koloneMapa, "BARKOD");
                    var dobavljac = ProcitajTekst(row, koloneMapa, "DOBAVLJAC");
                    var asSa = ProcitajDecimal(row, koloneMapa, "ASSA", false, rowErrors, redniBroj, "AS SA");
                    var asMo = ProcitajDecimal(row, koloneMapa, "ASMO", false, rowErrors, redniBroj, "AS MO");
                    var asBl = ProcitajDecimal(row, koloneMapa, "ASBL", false, rowErrors, redniBroj, "AS BL");
                    var opis = ProcitajTekst(row, koloneMapa, "OPIS");
                    var status = ProcitajTekst(row, koloneMapa, "STATUS");
                    var akcijskaMpc = ProcitajDecimal(row, koloneMapa, "AKCIJSKAMPC", true, rowErrors, redniBroj, "AKCIJSKA MPC");

                    if (JePrazanRed(sifra, naziv, barKod, dobavljac, opis, status, akcijskaMpc?.ToString(), asSa?.ToString(), asMo?.ToString(), asBl?.ToString()))
                    {
                        continue;
                    }

                    if (string.IsNullOrWhiteSpace(sifra))
                    {
                        rowErrors.Add($"Red {redniBroj}: kolona 'ŠIFRA ARTIKLA' je obavezna.");
                    }

                    if (string.IsNullOrWhiteSpace(naziv))
                    {
                        rowErrors.Add($"Red {redniBroj}: kolona 'NAZIV' je obavezna.");
                    }

                    if (string.IsNullOrWhiteSpace(status))
                    {
                        rowErrors.Add($"Red {redniBroj}: kolona 'STATUS' je obavezna.");
                    }

                    if (!string.IsNullOrWhiteSpace(sifra))
                    {
                        var normalizovanaSifra = sifra.Trim();
                        if (!postojeceSifre.Add(normalizovanaSifra))
                        {
                            rowErrors.Add($"Red {redniBroj}: pronađena duplirana šifra artikla '{normalizovanaSifra}'.");
                        }
                    }

                    if (rowErrors.Any())
                    {
                        greske.AddRange(rowErrors);
                        continue;
                    }

                    uneseniRedovi.Add(new VipArtikli
                    {
                        Idakcije = akcijaId,
                        NazivArtk = naziv,
                        SifraArtk = sifra,
                        BarKod = barKod,
                        Dobavljac = dobavljac,
                        AsSa = asSa,
                        AsMo = asMo,
                        AsBl = asBl,
                        Opis = opis,
                        Status = status,
                        AkcijskaMpc = akcijskaMpc,
                        Zaliha = 0
                    });
                }
            }

            if (greske.Any())
            {
                throw new InvalidOperationException($"Excel fajl sadrži greške: {string.Join(" | ", greske)}");
            }

            if (uneseniRedovi.Count == 0)
            {
                throw new InvalidOperationException("Nema validnih redova za import.");
            }

            var postojeciArtikli = await _context.VipArtiklis
                .Where(a => a.Idakcije == akcijaId)
                .ToListAsync();

            if (postojeciArtikli.Any())
            {
                _context.VipArtiklis.RemoveRange(postojeciArtikli);
                await _context.SaveChangesAsync();
            }

            await _context.VipArtiklis.AddRangeAsync(uneseniRedovi);
            await _context.SaveChangesAsync();

            return new VikendAkcijaImportResult
            {
                BrojRedova = uneseniRedovi.Count,
                Poruka = $"Uspješno importovano {uneseniRedovi.Count} artikala."
            };
        }

        private static VikendAkcijaStavkaDto MapirajStavku(VipStavke stavka, VipArtikli? artikal)
        {
            return new VikendAkcijaStavkaDto
            {
                Id = stavka.Id.ToString(),
                Sifra = artikal?.SifraArtk ?? stavka.SifraArtikla,
                Naziv = artikal?.NazivArtk ?? stavka.NazivArtikla,
                Kolicina = stavka.Kolicina,
                Prodavnica = stavka.Prodavnica,
                BarKod = artikal?.BarKod,
                Dobavljac = artikal?.Dobavljac,
                AsSa = artikal?.AsSa,
                AsMo = artikal?.AsMo,
                AsBl = artikal?.AsBl,
                Opis = artikal?.Opis,
                Status = artikal?.Status,
                AkcijskaMpc = artikal?.AkcijskaMpc,
                Zaliha = artikal?.Zaliha ?? 0,
                Komentar = stavka.Komentar
            };
        }

        private static VikendAkcijaStavkaDto MapirajArtikal(VipArtikli artikal)
        {
            return new VikendAkcijaStavkaDto
            {
                Id = artikal.Id.ToString(),
                Sifra = artikal.SifraArtk,
                Naziv = artikal.NazivArtk,
                Kolicina = 0,
                Prodavnica = null,
                BarKod = artikal.BarKod,
                Dobavljac = artikal.Dobavljac,
                AsSa = artikal.AsSa,
                AsMo = artikal.AsMo,
                AsBl = artikal.AsBl,
                Opis = artikal.Opis,
                Status = artikal.Status,
                AkcijskaMpc = artikal.AkcijskaMpc,
                Zaliha = artikal.Zaliha ?? 0,
                Komentar = null
            };
        }

        private static string NormalizujKolonu(string? naziv)
        {
            if (string.IsNullOrWhiteSpace(naziv))
            {
                return string.Empty;
            }

            var normalizovano = naziv.Trim().Normalize(NormalizationForm.FormD);
            var builder = new StringBuilder();

            foreach (var znak in normalizovano)
            {
                var kategorija = CharUnicodeInfo.GetUnicodeCategory(znak);
                if (kategorija == UnicodeCategory.NonSpacingMark)
                {
                    continue;
                }

                if (char.IsWhiteSpace(znak) || znak == '_' || znak == '-')
                {
                    continue;
                }

                builder.Append(char.ToUpperInvariant(znak));
            }

            return builder.ToString();
        }

        private static string ProcitajTekst(DataRow row, IDictionary<string, int> koloneMapa, string kljuc)
        {
            if (!koloneMapa.TryGetValue(kljuc, out var indeks))
            {
                return string.Empty;
            }

            var vrijednost = row[indeks];
            if (vrijednost == null || vrijednost == DBNull.Value)
            {
                return string.Empty;
            }

            return vrijednost.ToString()?.Trim() ?? string.Empty;
        }

        private static decimal? ProcitajDecimal(DataRow row, IDictionary<string, int> koloneMapa, string kljuc, bool obavezno, ICollection<string> greske, int redniBroj, string nazivKolone)
        {
            var tekst = ProcitajTekst(row, koloneMapa, kljuc);
            if (string.IsNullOrWhiteSpace(tekst))
            {
                if (obavezno)
                {
                    greske.Add($"Red {redniBroj}: kolona '{nazivKolone}' je obavezna.");
                }
                return null;
            }

            if (decimal.TryParse(tekst, NumberStyles.Any, CultureInfo.InvariantCulture, out var rezultat)
                || decimal.TryParse(tekst, NumberStyles.Any, new CultureInfo("bs-Latn-BA"), out rezultat))
            {
                return rezultat;
            }

            greske.Add($"Red {redniBroj}: vrijednost '{tekst}' u koloni '{nazivKolone}' nije validan broj.");
            return null;
        }

        private static bool JePrazanRed(params string?[] vrijednosti)
        {
            return vrijednosti.All(string.IsNullOrWhiteSpace);
        }

        private static string NormalizujSifru(string? sifra)
        {
            return string.IsNullOrWhiteSpace(sifra)
                ? string.Empty
                : sifra.Trim().ToUpperInvariant();
        }

        private static string KreirajStavkaKljuc(VipStavke stavka, VipArtikli? artikal)
        {
            var sifra = NormalizujSifru(artikal?.SifraArtk ?? stavka.SifraArtikla);

            if (string.IsNullOrWhiteSpace(sifra))
            {
                sifra = NormalizujSifru(artikal?.NazivArtk ?? stavka.NazivArtikla);
            }

            if (string.IsNullOrWhiteSpace(sifra))
            {
                sifra = NormalizujSifru(stavka.Id.ToString(CultureInfo.InvariantCulture));
            }

            var prodavnica = (stavka.Prodavnica ?? string.Empty).Trim().ToUpperInvariant();

            return $"{sifra}|{prodavnica}";
        }

        private static string GenerisiId()
        {
            return $"VIP-{Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper()}";
        }

        private static VikendAkcijaDto MapirajAkciju(VipZaglavlje zaglavlje)
        {
            return new VikendAkcijaDto
            {
                Id = zaglavlje.Id,
                Opis = zaglavlje.Opis,
                Pocetak = zaglavlje.Pocetak,
                Kraj = zaglavlje.Kraj,
                Status = IzracunajStatus(zaglavlje.Pocetak, zaglavlje.Kraj),
                BrojStavki = zaglavlje.VipStavkes?.Count ?? 0,
                UniqueId = zaglavlje.UniqueId,
                Produzeno = zaglavlje.Produzeno
            };
        }

        private static string? NormalizujKomentar(string? komentar)
        {
            if (string.IsNullOrWhiteSpace(komentar))
            {
                return null;
            }

            var trimmed = komentar.Trim();
            return trimmed.Length <= 50 ? trimmed : trimmed.Substring(0, 50);
        }

        private static string IzracunajStatus(DateTime pocetak, DateTime kraj, DateTime? trenutno = null)
        {
            var referentni = trenutno ?? DateTime.Now;
            var aktivno = referentni >= pocetak && referentni <= kraj;
            return aktivno ? "Aktivno" : "Istekao";
        }
    }
}
