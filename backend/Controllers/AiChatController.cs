using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using backend.Models;
using backend.Services.Chat;
using backend.Services.Knowledge;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
        private readonly IEnumerable<ITextExtractor> _textExtractors;
        private readonly ILogger<AiChatController> _logger;

        public AiChatController(RagChatService ragChatService, IEnumerable<ITextExtractor> textExtractors, ILogger<AiChatController> logger)
        {
            _ragChatService = ragChatService;
            _textExtractors = textExtractors;
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

        [HttpPost("/ai/chat-with-files")]
        public async Task<ActionResult<ChatResponseDto>> AskWithFilesAsync([FromForm] ChatWithFilesRequestDto requestDto, CancellationToken ct)
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
                UserId = userId,
                FileContexts = await ExtractFileContextsAsync(requestDto.Files, ct),
            };

            var chatResponse = await _ragChatService.AskAsync(chatRequest, ct);

            _logger.LogInformation("Chat-with-files response generated for user {UserId} in conversation {ConversationId}", userId, chatResponse.ConversationId);

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

        private async Task<IReadOnlyList<AdHocFileContext>> ExtractFileContextsAsync(IEnumerable<IFormFile>? files, CancellationToken ct)
        {
            var contexts = new List<AdHocFileContext>();

            if (files == null)
            {
                return contexts;
            }

            foreach (var file in files)
            {
                if (file == null || file.Length == 0)
                {
                    continue;
                }

                var extension = Path.GetExtension(file.FileName);
                var extractor = _textExtractors.FirstOrDefault(ex => ex.CanExtract(extension, file.ContentType));

                if (extractor == null)
                {
                    _logger.LogWarning("Unsupported file type {FileName} for chat-with-files", file.FileName);
                    continue;
                }

                await using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream, ct);
                memoryStream.Position = 0;

                var textContent = await extractor.ExtractTextAsync(memoryStream, ct);

                if (string.IsNullOrWhiteSpace(textContent))
                {
                    _logger.LogWarning("No text extracted from {FileName}", file.FileName);
                    continue;
                }

                contexts.Add(new AdHocFileContext
                {
                    FileName = file.FileName,
                    Content = textContent,
                });
            }

            return contexts;
        }
    }
}
