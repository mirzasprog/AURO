using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Text;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DailyTasksController : ControllerBase
    {
        private readonly IDailyTaskRepository _repository;

        public DailyTasksController(IDailyTaskRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("today")]
        public async Task<IActionResult> GetTodayTasks([FromQuery] int? storeId, [FromQuery] string? type = null)
        {
            var today = DateTime.Today;
            if (storeId.HasValue)
            {
                await _repository.EnsureDailyTasksGeneratedAsync(storeId.Value, today);
                var tasks = await _repository.GetTasksForStoreAsync(storeId.Value, today, type);
                return Ok(tasks);
            }

            var currentStoreTasks = await _repository.GetTasksForCurrentStoreAsync(today, type);
            return Ok(currentStoreTasks);
        }

        [HttpGet("stores")]
        [Authorize(Roles = "podrucni,regionalni,interna,uprava")]
        public async Task<IActionResult> GetStores()
        {
            var stores = await _repository.GetStoresAsync();
            return Ok(stores);
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetHistory([FromQuery] int? storeId, [FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] string? status = null, [FromQuery] string? type = null)
        {
            var fromDate = from?.Date ?? DateTime.Today.AddDays(-30);
            var toDate = to?.Date ?? DateTime.Today;
            var tasks = await _repository.GetTaskHistoryAsync(fromDate, toDate, storeId, status, type);
            return Ok(tasks);
        }

        [HttpGet("report")]
        public async Task<IActionResult> GetReport([FromQuery] int? storeId, [FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] string? status = null, [FromQuery] string? type = null)
        {
            var fromDate = from?.Date ?? DateTime.Today.AddDays(-30);
            var toDate = to?.Date ?? DateTime.Today;
            var tasks = await _repository.GetTaskHistoryAsync(fromDate, toDate, storeId, status, type);

            var sb = new StringBuilder();
            sb.AppendLine("Id,Title,Description,Type,Status,Date,Store,CreatedBy,CompletedBy,CompletedAt,IsRecurring,ImageAllowed");
            foreach (var task in tasks)
            {
                var row = new[]
                {
                    task.Id.ToString(),
                    EscapeCsv(task.Title),
                    EscapeCsv(task.Description),
                    EscapeCsv(task.Type),
                    EscapeCsv(task.Status),
                    task.Date.ToString("yyyy-MM-dd"),
                    EscapeCsv(task.ProdavnicaNaziv ?? task.ProdavnicaBroj),
                    EscapeCsv(task.CreatedBy),
                    EscapeCsv(task.CompletedBy),
                    task.CompletedAt?.ToString("yyyy-MM-dd HH:mm"),
                    task.IsRecurring ? "Da" : "Ne",
                    task.ImageAllowed ? "Da" : "Ne"
                };
                sb.AppendLine(string.Join(",", row));
            }

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());
            var fileName = $"daily-tasks-report-{fromDate:yyyyMMdd}-{toDate:yyyyMMdd}.csv";
            return File(bytes, "text/csv", fileName);
        }

        [HttpPost("store/{storeId:int}/custom")]
        [Authorize(Roles = "podrucni,regionalni,prodavnica,uprava")]
        public async Task<IActionResult> CreateCustomTask(int storeId, [FromBody] DailyTaskCreateRequest request)
        {
            request.ProdavnicaId = storeId;
            var result = await _repository.CreateCustomTaskAsync(request);
            if (!result.Success)
            {
                return BadRequest(new { poruka = result.Error });
            }

            return Ok(result.Task);
        }

        [HttpPost("bulk")]
        [Authorize(Roles = "uprava")]
        public async Task<IActionResult> CreateBulkCustomTask([FromBody] DailyTaskBulkCreateRequest request)
        {
            var result = await _repository.CreateBulkCustomTasksAsync(request);
            if (!result.Success)
            {
                return BadRequest(new { poruka = result.Error });
            }

            return Ok(new { brojZadataka = result.CreatedTasks, brojProdavnica = result.StoreCount });
        }

        [HttpPut("custom/{taskId:int}")]
        [Authorize(Roles = "podrucni,regionalni,prodavnica,uprava")]
        public async Task<IActionResult> UpdateCustomTask(int taskId, [FromBody] DailyTaskUpdateRequest request)
        {
            var result = await _repository.UpdateCustomTaskAsync(taskId, request);
            if (!result.Success)
            {
                return BadRequest(new { poruka = result.Error });
            }

            return Ok(result.Task);
        }

        [HttpPut("{taskId:int}/status")]
        public async Task<IActionResult> UpdateStatus(int taskId, [FromForm] DailyTaskStatusUpdateRequest request)
        {
            var result = await _repository.UpdateTaskStatusAsync(taskId, request);
            if (!result.Success)
            {
                return BadRequest(new { poruka = result.Error });
            }

            return Ok(result.Task);
        }

        private static string EscapeCsv(string? value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return string.Empty;
            }

            var escaped = value.Replace("\"", "\"\"");
            return $"\"{escaped}\"";
        }
    }
}
