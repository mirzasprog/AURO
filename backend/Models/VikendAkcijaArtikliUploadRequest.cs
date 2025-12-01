using Microsoft.AspNetCore.Http;

namespace backend.Models
{
    public class VikendAkcijaArtikliUploadRequest
    {
        public string? AkcijaId { get; set; }

        public IFormFile? File { get; set; }
    }
}
