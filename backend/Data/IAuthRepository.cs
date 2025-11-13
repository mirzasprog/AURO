namespace backend.Data {
    public interface IAuthRepository
    {
        bool Prijava(string korisnickoIme, string lozinka, string kljuc);
    }
}