using System.Threading;
using System.Threading.Tasks;
using backend.Models;
using backend.Services.KnowledgeBase;
using backend.Services.OpenAi;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/chatbot")]
    [Authorize]
    public class ChatbotController : ControllerBase
    {
        private readonly KnowledgeBaseService _knowledgeBaseService;
        private readonly OpenAiChatService _chatService;

        public ChatbotController(KnowledgeBaseService knowledgeBaseService, OpenAiChatService chatService)
        {
            _knowledgeBaseService = knowledgeBaseService;
            _chatService = chatService;
        }

        [HttpPost]
        public async Task<ActionResult<ChatbotResponse>> AskAsync([FromBody] ChatbotRequest request, CancellationToken ct)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var documents = await _knowledgeBaseService.SearchAsync(request.Message, topN: 5, ct);
            var contextBlock = KnowledgeBaseService.BuildContextBlock(documents);

            var systemPrompt = "Ti si interni Konzum360 asistent. Odgovaraj prvenstveno koristeći dio 'Kontekst'. Ako u kontekstu nema tačnog odgovora, jasno reci da na osnovu dostupnog konteksta nemaš podatke i nemoj izmišljati.";

            var answer = await _chatService.AskAsync(systemPrompt, request.Message, string.IsNullOrWhiteSpace(contextBlock) ? null : contextBlock, ct);

            return Ok(new ChatbotResponse
            {
                Answer = answer,
            });
        }
    }
}
