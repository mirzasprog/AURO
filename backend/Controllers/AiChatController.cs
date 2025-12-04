using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using backend.Models;
using backend.Services.Chat;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace backend.Controllers
{
    [ApiController]
    [Route("ai/chat")]
    [Authorize]
    public class AiChatController : ControllerBase
    {
        private readonly RagChatService _ragChatService;
        private readonly ILogger<AiChatController> _logger;

        public AiChatController(RagChatService ragChatService, ILogger<AiChatController> logger)
        {
            _ragChatService = ragChatService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<ChatResponseDto>> AskAsync([FromBody] ChatRequestDto requestDto, CancellationToken ct)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User?.Identity?.Name ?? "unknown";

            var chatRequest = new ChatRequest
            {
                ConversationId = requestDto.ConversationId,
                Question = requestDto.Question,
                DepartmentFilter = requestDto.Department,
                TagsFilter = requestDto.Tags,
                UserId = userId,
            };

            // TODO: Stream responses via SSE/WebSockets for real-time typing experience.
            // The RagChatService could be extended to return IAsyncEnumerable tokens that we forward.
            var chatResponse = await _ragChatService.AskAsync(chatRequest, ct);

            _logger.LogInformation("Chat response generated for user {UserId} in conversation {ConversationId}", userId, chatResponse.ConversationId);

            var response = new ChatResponseDto
            {
                ConversationId = chatResponse.ConversationId,
                Answer = chatResponse.Answer,
                Sources = chatResponse.UsedChunks.Select(chunk => new ChatSourceDto
                {
                    ChunkId = chunk.ChunkId,
                    DocumentId = chunk.DocumentId,
                    FileName = chunk.FileName,
                    Section = chunk.Section,
                }).ToList(),
            };

            return Ok(response);
        }
    }
}
