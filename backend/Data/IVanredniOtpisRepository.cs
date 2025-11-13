using backend.Models;

namespace backend.Data {
    public interface IVanredniOtpisRepository {
        UneseniVanredniOtpis? DodajVanredniOtpis(NoviVanredniOtpis o);
        void SpremiListuVanrednihOtpisa(IEnumerable<NoviVanredniOtpis> listaVanrednihOtpisa);
        void ReklamacijaKvaliteta(IEnumerable<tbl_ReklamacijeKvaliteta > lista);
        bool ArtikalPostoji(string? sifraArtikla);
        IEnumerable<PregledOtpisa> PregledajOtpise(DateTime datumOd, DateTime datumDo);
        IEnumerable<GetPodaciReklamacije > PregledReklamacijaKvaliteta(DateTime datumOd, DateTime datumDo);
        IEnumerable<DetaljiArtiklaReklamacija> DetaljiArtiklaReklamacije(string SifraArtikla);
        IEnumerable<DetaljiVanrednogOtpisa> PreuzmiDetaljeOtpisa(string brojOtpisa);
        IEnumerable<ZahtjeviVanredniOtpis> PregledajZahtjeveVanrednihOtpisa();
        IEnumerable<ZahtjeviVanredniOtpisDetalji> PregledajZahtjeveVanrednihOtpisaDetalji(string brojOtpisa);
        void OdbijArtikle(ListaOdbijenihArtikala listaOdbijenihArtikala);
        void OdobriOtpis(OdobravanjeOtpisa o);
        IEnumerable<DetaljiVanrednogOtpisaOdbijeno> PreuzmiDetaljeOdbijenihOtpisa(string brojOtpisa);
        IEnumerable<DetaljiVanrednogOtpisaOdobreno> PreuzmiDetaljeOdobrenihOtpisa(string brojOtpisa);
         IEnumerable<ZavrseniVanredniZahtjevi> PregledajZavrseneVanredneZahtjeve(DateTime datumOd, DateTime datumDo);
    }
}