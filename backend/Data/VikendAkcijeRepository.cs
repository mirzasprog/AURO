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
            var r = _context.VikendAkcijaStavkaDto.FromSqlInterpolated($"EXEC GetVIPArtikli {vikendAkcijaId}");
            return r;
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

        public async Task<bool> UpdateStavkeAsync(string vikendAkcijaId, IEnumerable<VikendAkcijaStavkaUpdate> izmjene)
        {
            var izmjeneLista = izmjene.ToList();
            if (!izmjeneLista.Any())
            {
                return true;
            }

            var zaglavljeId = await _context.VipZaglavljes
                .Where(z => z.UniqueId == vikendAkcijaId)
                .Select(z => z.Id)
                .FirstOrDefaultAsync();

            if (zaglavljeId == 0)
            {
                return false;
            }

            var stavkeIds = izmjeneLista.Select(i => i.Id).ToList();
            var stavke = await _context.VipStavkes
                .Where(s => s.VipZaglavljeId == zaglavljeId && stavkeIds.Contains(s.Id))
                .ToListAsync();

            foreach (var stavka in stavke)
            {
                var novaVrijednost = izmjeneLista.First(i => i.Id == stavka.Id);
                stavka.Kolicina = novaVrijednost.Kolicina;
                stavka.VrijemeUnosaIzProdavnice = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();

            return true;
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
