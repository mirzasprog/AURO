using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/unanswered-questions")]
    [Authorize]
    public class UnansweredQuestionsController : ControllerBase
    {
        private readonly Auro2Context _dbContext;

        public UnansweredQuestionsController(Auro2Context dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UnansweredQuestion>>> GetAllAsync(CancellationToken ct)
        {
            var unanswered = await _dbContext.UnansweredQuestions
                .AsNoTracking()
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync(ct);
            return Ok(unanswered);
        }
    }
}
