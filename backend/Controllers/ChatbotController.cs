using System.Threading;
using System.Threading.Tasks;
using backend.Models;
using backend.Services.Chatbot;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/chatbot")]
    [Authorize]
    public class ChatbotController : ControllerBase
    {
        private readonly LocalChatbotService _localChatbotService;

        public ChatbotController(LocalChatbotService localChatbotService)
        {
            _localChatbotService = localChatbotService;
        }

        [HttpPost]
        public async Task<ActionResult<ChatbotResponse>> AskAsync([FromBody] ChatbotRequest request, CancellationToken ct)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var answer = await _localChatbotService.AskAsync(request.Message, ct);
            return Ok(answer);
        }
    }
}
