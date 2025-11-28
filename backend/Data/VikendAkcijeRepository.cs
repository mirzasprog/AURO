using System;
using System.Collections.Generic;
using System.Linq;
using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;

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
            return await _context.VipZaglavljes
                .AsNoTracking()
                .OrderByDescending(z => z.Pocetak)
                .Select(z => new VikendAkcijaDto
                {
                    Id = z.Id,
                    Opis = z.Opis,
                    Pocetak = z.Pocetak,
                    Kraj = z.Kraj,
                    Status = z.Status,
                    BrojStavki = z.VipStavkes.Count
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<VikendAkcijaStavkaDto>> GetStavkeAsync(int vikendAkcijaId)
        {
            return await _context.VipStavkes
                .AsNoTracking()
                .Where(s => s.VipZaglavljeId == vikendAkcijaId)
                .OrderBy(s => s.NazivArtikla)
                .Select(s => new VikendAkcijaStavkaDto
                {
                    Id = s.Id,
                    Sifra = s.SifraArtikla,
                    Naziv = s.NazivArtikla,
                    Kolicina = s.Kolicina,
                    Prodavnica = s.Prodavnica
                })
                .ToListAsync();
        }

        public async Task UpdateStavkeAsync(int vikendAkcijaId, IEnumerable<VikendAkcijaStavkaUpdate> izmjene)
        {
            var izmjeneLista = izmjene.ToList();
            if (!izmjeneLista.Any())
            {
                return;
            }

            var stavkeIds = izmjeneLista.Select(i => i.Id).ToList();
            var stavke = await _context.VipStavkes
                .Where(s => s.VipZaglavljeId == vikendAkcijaId && stavkeIds.Contains(s.Id))
                .ToListAsync();

            foreach (var stavka in stavke)
            {
                var novaVrijednost = izmjeneLista.First(i => i.Id == stavka.Id);
                stavka.Kolicina = novaVrijednost.Kolicina;
                stavka.VrijemeUnosaIzProdavnice = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
        }
    }
}
