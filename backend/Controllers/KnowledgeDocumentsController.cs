using System.Threading;
using System.Threading.Tasks;
using backend.Models;
using backend.Services.KnowledgeBase;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/knowledge-docs")]
    [Authorize]
    public class KnowledgeDocumentsController : ControllerBase
    {
        private readonly KnowledgeBaseService _knowledgeBaseService;

        public KnowledgeDocumentsController(KnowledgeBaseService knowledgeBaseService)
        {
            _knowledgeBaseService = knowledgeBaseService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] KnowledgeDocumentCreateRequest request, CancellationToken ct)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _knowledgeBaseService.AddDocumentAsync(request.Title, request.Content, ct);
            return Ok();
        }
    }
}
