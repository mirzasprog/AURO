using backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardRepository _repository;

        public DashboardController(IDashboardRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary([FromQuery] int? storeId, [FromQuery] DateTime? date)
        {
            var targetDate = date?.Date ?? DateTime.Today;
            var summary = await _repository.GetDashboardSummaryAsync(storeId, targetDate);
            return Ok(summary);
        }
    }
}
