using System.Threading;
using System.Threading.Tasks;
using backend.Models;
using backend.Services.Knowledge;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [ApiController]
    [Route("ai/documents")]
    [Authorize]
    public class AiDocumentsController : ControllerBase
    {
        private readonly DocumentImportService _documentImportService;
        private readonly ILogger<AiDocumentsController> _logger;

        public AiDocumentsController(DocumentImportService documentImportService, ILogger<AiDocumentsController> logger)
        {
            _documentImportService = documentImportService;
            _logger = logger;
        }

        [HttpPost("import")]
        [DisableRequestSizeLimit]
        public async Task<ActionResult<DocumentImportResponse>> ImportAsync([FromForm] DocumentImportRequest request, CancellationToken ct)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var document = await _documentImportService.ImportAsync(request, ct);

            _logger.LogInformation("Imported knowledge document {DocumentId} with {ChunkCount} chunks", document.Id, document.Chunks.Count);

            var response = new DocumentImportResponse
            {
                DocumentId = document.Id,
                ChunkCount = document.Chunks.Count,
                FileName = document.FileName,
                Department = document.Department,
            };

            return Ok(response);
        }
    }
}
