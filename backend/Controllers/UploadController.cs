using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Data;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UploadController : ControllerBase
    {
        private readonly IUploadRepository _repo;
        public UploadController(IUploadRepository repo)
        {
            _repo = repo;
        }

        [HttpPost, DisableRequestSizeLimit]

        public async Task<IActionResult> Upload()
        {
            // try
            // {
            var formCollection = await Request.ReadFormAsync();
            var file = formCollection.Files.First();
            var folderName = Path.Combine("Resources", DateTime.Now.ToString("dd-MM-yyyy"));

            if (!Directory.Exists(folderName))
            {
                Directory.CreateDirectory(folderName);
            }

            var pathToSave = Path.Join(Directory.GetCurrentDirectory(), folderName);

            if (file.Length > 0)
            {
                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName?.Trim('"');
                fileName = DateTime.Now.ToString("HHmmss") + fileName;
                var fullPath = Path.Join(pathToSave, fileName);
                var dbPath = Path.Join(folderName, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                int r = _repo.SpremiUbazu(fullPath);

                if (r == 0)
                    return StatusCode(500, new { poruka = "Provjerite da li Excel fajl sadrži ispravne nazive kolona!" });

                return Ok(new { dbPath });
            }
            else
            {
                return BadRequest();
            }
            //}
            // catch (Exception ex)
            // {
            //     return StatusCode(500, $"Internal server error: {ex}");
            // }
        }
    }
}
