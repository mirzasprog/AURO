using System.Security.Cryptography;
using System.Text;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly Auro2Context _context;

        public AuthRepository(Auro2Context context)
        {
            _context = context;
        }

        // source: https://www.findandsolve.com/articles/encrypt-and-decrypt-string-in-asp-dot-net-core-dot-net-5
        public static string EncryptString(string plainText, string key)
        {
            byte[] iv = new byte[16];
            byte[] array;
            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(key);
                aes.IV = iv;
                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter streamWriter = new StreamWriter((Stream)cryptoStream))
                        {
                            streamWriter.Write(plainText);
                        }
                        array = memoryStream.ToArray();
                    }
                }
            }
            return Convert.ToBase64String(array);
        }

        public bool Prijava(string korisnickoIme, string lozinka, string kljuc)
        {
            string kriptovanaLozinka = EncryptString(lozinka, kljuc);
            var korisnik = _context.Korisnik.AsNoTracking().FirstOrDefault(x => x.KorisnickoIme == korisnickoIme && x.Lozinka == kriptovanaLozinka && x.Aktivan == true);
            // && x.Aktivan == true);

            if (korisnik == null)
                return false;
            return true;

        }
    }
}