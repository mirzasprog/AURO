using System;
using System.Globalization;
using System.Text;
using System.Threading.Tasks;
using backend.Data;
using backend.Models.Shifts;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ShiftsController : ControllerBase
    {
        private readonly IShiftRepository _repository;

        public ShiftsController(IShiftRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetShifts([FromQuery] int? storeId, [FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] int? employeeId, [FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
        {
            try
            {
                var result = await _repository.GetShiftsAsync(new ShiftQueryParameters
                {
                    StoreId = storeId,
                    From = from,
                    To = to,
                    EmployeeId = employeeId,
                    Status = status,
                    Page = page,
                    PageSize = pageSize
                });

                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMyShifts([FromQuery] DateTime? from, [FromQuery] DateTime? to)
        {
            var result = await _repository.GetMyShiftsAsync(from, to);
            return Ok(result);
        }

        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees([FromQuery] int? storeId)
        {
            try
            {
                var result = await _repository.GetEmployeesAsync(storeId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "podrucni,regionalni,prodavnica,uprava")]
        public async Task<IActionResult> CreateShift([FromBody] ShiftCreateRequest request)
        {
            var result = await _repository.CreateShiftAsync(request);
            if (!result.Success)
            {
                return BadRequest(new { poruka = result.Error });
            }

            return Ok(new ShiftMutationResponse
            {
                Shift = result.Shift!,
                Warning = result.Warning
            });
        }

        [HttpPut("{shiftId:int}")]
        [Authorize(Roles = "podrucni,regionalni,prodavnica,uprava")]
        public async Task<IActionResult> UpdateShift(int shiftId, [FromBody] ShiftUpdateRequest request)
        {
            var result = await _repository.UpdateShiftAsync(shiftId, request);
            if (!result.Success)
            {
                return BadRequest(new { poruka = result.Error });
            }

            return Ok(new ShiftMutationResponse
            {
                Shift = result.Shift!,
                Warning = result.Warning
            });
        }

        [HttpDelete("{shiftId:int}")]
        [Authorize(Roles = "podrucni,regionalni,prodavnica,uprava")]
        public async Task<IActionResult> DeleteShift(int shiftId)
        {
            var result = await _repository.DeleteShiftAsync(shiftId);
            if (!result.Success)
            {
                return BadRequest(new { poruka = result.Error });
            }

            return Ok(new ShiftMutationResponse { Shift = result.Shift! });
        }

        [HttpPost("copy-week")]
        [Authorize(Roles = "podrucni,regionalni,prodavnica,uprava")]
        public async Task<IActionResult> CopyWeek([FromBody] ShiftCopyWeekRequest request)
        {
            var result = await _repository.CopyWeekAsync(request);
            if (!result.Success)
            {
                return BadRequest(new { poruka = result.Error });
            }

            return Ok(result.Shift);
        }

        [HttpPost("publish")]
        [Authorize(Roles = "podrucni,regionalni,prodavnica,uprava")]
        public async Task<IActionResult> PublishWeek([FromBody] ShiftPublishRequest request)
        {
            var result = await _repository.PublishAsync(request);
            if (!result.Success)
            {
                return BadRequest(new { poruka = result.Error });
            }

            return Ok(result.Shift);
        }

        [HttpGet("export")]
        [Authorize(Roles = "podrucni,regionalni,prodavnica,uprava")]
        public async Task<IActionResult> Export([FromQuery] int? storeId, [FromQuery] DateTime? from, [FromQuery] DateTime? to, [FromQuery] string format = "xlsx")
        {
            try
            {
                var shifts = await _repository.GetShiftsForExportAsync(new ShiftQueryParameters
                {
                    StoreId = storeId,
                    From = from,
                    To = to,
                    Page = 1,
                    PageSize = 10000
                });

                var exportFormat = string.IsNullOrWhiteSpace(format) ? "xlsx" : format.ToLowerInvariant();
                if (exportFormat == "csv")
                {
                    var csv = new StringBuilder();
                    csv.AppendLine("Store,Employee,Date,Start,End,BreakMinutes,Type,Status,Note");
                    foreach (var shift in shifts)
                    {
                        csv.AppendLine(string.Join(',', new[]
                        {
                            EscapeCsv(shift.StoreLabel),
                            EscapeCsv(shift.EmployeeName),
                            shift.ShiftDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                            shift.StartTime.ToString("hh\\:mm"),
                            shift.EndTime.ToString("hh\\:mm"),
                            shift.BreakMinutes.ToString(CultureInfo.InvariantCulture),
                            EscapeCsv(shift.ShiftType),
                            EscapeCsv(shift.Status),
                            EscapeCsv(shift.Note)
                        }));
                    }

                    return File(Encoding.UTF8.GetBytes(csv.ToString()), "text/csv", "smjene.csv");
                }

                using var workbook = new XLWorkbook();
                var sheet = workbook.AddWorksheet("Smjene");
                sheet.Cell(1, 1).Value = "Prodavnica";
                sheet.Cell(1, 2).Value = "Zaposlenik";
                sheet.Cell(1, 3).Value = "Datum";
                sheet.Cell(1, 4).Value = "Početak";
                sheet.Cell(1, 5).Value = "Kraj";
                sheet.Cell(1, 6).Value = "Pauza (min)";
                sheet.Cell(1, 7).Value = "Tip";
                sheet.Cell(1, 8).Value = "Status";
                sheet.Cell(1, 9).Value = "Napomena";

                var row = 2;
                foreach (var shift in shifts)
                {
                    sheet.Cell(row, 1).Value = shift.StoreLabel;
                    sheet.Cell(row, 2).Value = shift.EmployeeName;
                    sheet.Cell(row, 3).Value = shift.ShiftDate;
                    sheet.Cell(row, 4).Value = shift.StartTime.ToString("hh\\:mm");
                    sheet.Cell(row, 5).Value = shift.EndTime.ToString("hh\\:mm");
                    sheet.Cell(row, 6).Value = shift.BreakMinutes;
                    sheet.Cell(row, 7).Value = shift.ShiftType;
                    sheet.Cell(row, 8).Value = shift.Status;
                    sheet.Cell(row, 9).Value = shift.Note;
                    row++;
                }

                sheet.Columns().AdjustToContents();

                using var stream = new System.IO.MemoryStream();
                workbook.SaveAs(stream);
                stream.Position = 0;

                return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "smjene.xlsx");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        private static string EscapeCsv(string? value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return string.Empty;
            }

            if (value.Contains(',') || value.Contains('"') || value.Contains('\n'))
            {
                return $"\"{value.Replace("\"", "\"\"")}\"";
            }

            return value;
        }
    }
}
