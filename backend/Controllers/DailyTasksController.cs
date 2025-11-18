using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;

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
    }
}
