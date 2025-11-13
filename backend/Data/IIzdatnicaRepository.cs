using backend.Models;

namespace backend.Data {
    public interface IIzdatnicaRepository {
        public void SpremiListuIzdatnica(IEnumerable<NovaIzdatnica> izdatnice);
        public IEnumerable<PregledIzdatnica> PreuzmiIzdatnice(DateTime datumOd, DateTime datumDo);
        public bool ArtikalPostoji(string? sifraArtikla);
        IEnumerable<ArtikliIzdatniceDetalji> PreuzmiArtikleIzdatnice(string brojIzdatnice);
        public UnesenaIzdatnica? DodajIzdatnicu(NovaIzdatnica i);
        IEnumerable<ZahtjeviIzdatnice> PregledajZahtjeveIzdatnica();
        IEnumerable<ZahtjeviIzdatniceDetalji> PregledajZahtjeveIzdatniceDetalji(string brojIzdatnice);
        IEnumerable<PregledIzdatnicaInterna> PregledajIzdatniceInterna(DateTime datumOd, DateTime datumDo);
    }
}