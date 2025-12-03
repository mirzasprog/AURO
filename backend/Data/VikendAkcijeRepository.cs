using System;
using System.Collections.Generic;
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
                    UniqueId = z.UniqueId
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

            return await _context.VipStavkes
                .AsNoTracking()
                .Where(s => s.VipZaglavljeId == zaglavljeId)
                .OrderBy(s => s.SifraArtikla)
                .Select(s => new VikendAkcijaStavkaDto
                {
                    Id = s.Id.ToString(),
                    Sifra = s.SifraArtikla,
                    Naziv = s.NazivArtikla,
                    Kolicina = s.Kolicina,
                    Prodavnica = s.Prodavnica
                })
                .ToListAsync();
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
                    SifraArtk = a.SifraArtk
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
                    Prodavnica = i.BrojProdavnice?.Trim()
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
                        VipZaglavljeId = zaglavljeId,
                        VrijemeUnosaIzProdavnice = DateTime.UtcNow
                    });

                    rezultat.BrojDodanih++;
                }
            }

            await _context.SaveChangesAsync();

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
                UniqueId = uniqueId
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
                UniqueId = zaglavlje.UniqueId
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
            using (var stream = file.OpenReadStream())
            using (var reader = ExcelReaderFactory.CreateReader(stream))
            {
                var dataSet = reader.AsDataSet();
                if (dataSet.Tables.Count == 0)
                {
                    throw new InvalidOperationException("Excel fajl ne sadrži podatke.");
                }

                var table = dataSet.Tables[0];
                for (var i = 0; i < table.Rows.Count; i++)
                {
                    var row = table.Rows[i];
                    var naziv = row[0]?.ToString()?.Trim();
                    var sifra = row[1]?.ToString()?.Trim();

                    if (i == 0 && (string.Equals(naziv, "NazivArtk", StringComparison.OrdinalIgnoreCase)
                        || string.Equals(naziv, "NazivArtikla", StringComparison.OrdinalIgnoreCase)))
                    {
                        continue; // preskoči header
                    }

                    if (string.IsNullOrWhiteSpace(naziv) && string.IsNullOrWhiteSpace(sifra))
                    {
                        continue;
                    }

                    uneseniRedovi.Add(new VipArtikli
                    {
                        Idakcije = akcijaId,
                        NazivArtk = naziv,
                        SifraArtk = sifra
                    });
                }
            }

            if (uneseniRedovi.Count == 0)
            {
                throw new InvalidOperationException("Nema validnih redova za import.");
            }

            await _context.VipArtiklis.AddRangeAsync(uneseniRedovi);
            await _context.SaveChangesAsync();

            return new VikendAkcijaImportResult
            {
                BrojRedova = uneseniRedovi.Count,
                Poruka = $"Uspješno importovano {uneseniRedovi.Count} artikala."
            };
        }

        private static string GenerisiId()
        {
            return $"VIP-{Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper()}";
        }

        private static string IzracunajStatus(DateTime pocetak, DateTime kraj, DateTime? trenutno = null)
        {
            var referentni = trenutno ?? DateTime.Now;
            var aktivno = referentni >= pocetak && referentni <= kraj;
            return aktivno ? "Aktivno" : "Istekao";
        }
    }
}
