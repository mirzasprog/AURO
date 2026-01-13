using System;
using System.Threading.Tasks;
using backend.Data;
using backend.Models.Shifts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/shift-requests")]
    [ApiController]
    public class ShiftRequestsController : ControllerBase
    {
        private readonly IShiftRepository _repository;

        public ShiftRequestsController(IShiftRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        [Authorize(Roles = "podrucni,regionalni,prodavnica,uprava")]
        public async Task<IActionResult> CreateRequest([FromBody] ShiftRequestCreateRequest request)
        {
            try
            {
                var result = await _repository.CreateShiftRequestAsync(request);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetRequests([FromQuery] int? storeId, [FromQuery] string? status)
        {
            try
            {
                var result = await _repository.GetShiftRequestsAsync(storeId, status);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpPut("{requestId:int}/approve")]
        [Authorize(Roles = "podrucni,regionalni,uprava")]
        public async Task<IActionResult> Approve(int requestId, [FromBody] ShiftRequestDecisionRequest request)
        {
            try
            {
                var result = await _repository.ApproveShiftRequestAsync(requestId, request.ManagerNote);
                if (result == null)
                {
                    return NotFound(new { poruka = "Zahtjev nije pronađen." });
                }

                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }

        [HttpPut("{requestId:int}/reject")]
        [Authorize(Roles = "podrucni,regionalni,uprava")]
        public async Task<IActionResult> Reject(int requestId, [FromBody] ShiftRequestDecisionRequest request)
        {
            try
            {
                var result = await _repository.RejectShiftRequestAsync(requestId, request.ManagerNote);
                if (result == null)
                {
                    return NotFound(new { poruka = "Zahtjev nije pronađen." });
                }

                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { poruka = ex.Message });
            }
        }
    }
}
