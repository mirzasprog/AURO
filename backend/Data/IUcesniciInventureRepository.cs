using backend.Models;

namespace backend.Data
{
    public interface IUcesniciInventureRepository
    {
       // IEnumerable<UnosUcesnikaInventure> UcesniciInventure();
        public UneseniUcesniciInventure? DodajUnos(UnosUcesnikaInventure i);
        public void SpremiListuUcesnika(IEnumerable<UnosUcesnikaInventure> ucesnici);
        IEnumerable<PregledUcesnika> PregledajUcesnikeInvenure(DateTime datumOd, DateTime datumDo);
    }
}