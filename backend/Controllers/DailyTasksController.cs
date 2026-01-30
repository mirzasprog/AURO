using backend.Data;
using backend.Models;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;

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

            using var workbook = new XLWorkbook();
            var sheet = workbook.AddWorksheet("Daily tasks");

            sheet.Cell(1, 1).Value = "Id";
            sheet.Cell(1, 2).Value = "Title";
            sheet.Cell(1, 3).Value = "Description";
            sheet.Cell(1, 4).Value = "Type";
            sheet.Cell(1, 5).Value = "Status";
            sheet.Cell(1, 6).Value = "Date";
            sheet.Cell(1, 7).Value = "Store";
            sheet.Cell(1, 8).Value = "CreatedBy";
            sheet.Cell(1, 9).Value = "CompletedBy";
            sheet.Cell(1, 10).Value = "CompletedAt";
            sheet.Cell(1, 11).Value = "IsRecurring";
            sheet.Cell(1, 12).Value = "ImageAllowed";

            var row = 2;
            foreach (var task in tasks)
            {
                sheet.Cell(row, 1).Value = task.Id;
                sheet.Cell(row, 2).Value = task.Title;
                sheet.Cell(row, 3).Value = task.Description;
                sheet.Cell(row, 4).Value = task.Type;
                sheet.Cell(row, 5).Value = task.Status;
                sheet.Cell(row, 6).Value = task.Date.ToString("yyyy-MM-dd");
                sheet.Cell(row, 7).Value = task.ProdavnicaNaziv ?? task.ProdavnicaBroj;
                sheet.Cell(row, 8).Value = task.CreatedBy;
                sheet.Cell(row, 9).Value = task.CompletedBy;
                sheet.Cell(row, 10).Value = task.CompletedAt?.ToString("yyyy-MM-dd HH:mm");
                sheet.Cell(row, 11).Value = task.IsRecurring ? "Da" : "Ne";
                sheet.Cell(row, 12).Value = task.ImageAllowed ? "Da" : "Ne";
                row++;
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;
            var fileName = $"daily-tasks-report-{fromDate:yyyyMMdd}-{toDate:yyyyMMdd}.xlsx";
            return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
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

    }
}
