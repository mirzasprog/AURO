using backend.Models;

namespace backend.Data {
    public interface INeuslovnaRobaRepository {
        UnesenaNeuslovnaRoba? DodajNeuslovnuRobu(NovaNeuslovnaRoba r);
        void SpremiListuNeuslovneRobe(IEnumerable<NovaNeuslovnaRoba> listaOtpisa);
        bool ArtikalPostoji(string? sifraArtikla);
        public IEnumerable<PregledNeuslovneRobe> PreuzmiNeuslovnuRobu(DateTime datumOd, DateTime datumDo);
        IEnumerable<ArtikliNeuslovneRobeDetalji> PreuzmiArtikleNeuslovneRobe(string brojNeuslovneRobe);
        IEnumerable<PregledNeuslovneRobe> PregledajNeuslovnuRobuInterna(DateTime datumOd, DateTime datumDo);
    }
}