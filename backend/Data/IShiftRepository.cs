using backend.Models;
using backend.Models.Shifts;

namespace backend.Data
{
    public interface IShiftRepository
    {
        Task<PagedResult<ShiftDto>> GetShiftsAsync(ShiftQueryParameters parameters);
        Task<IEnumerable<ShiftDto>> GetShiftsForExportAsync(ShiftQueryParameters parameters);
        Task<IEnumerable<ShiftDto>> GetMyShiftsAsync(DateTime? from, DateTime? to);
        Task<IEnumerable<ShiftEmployeeDto>> GetEmployeesAsync(int? storeId);
        Task<ShiftOperationResult> CreateShiftAsync(ShiftCreateRequest request);
        Task<ShiftOperationResult> UpdateShiftAsync(int shiftId, ShiftUpdateRequest request);
        Task<ShiftOperationResult> DeleteShiftAsync(int shiftId);
        Task<ShiftOperationResult> CopyWeekAsync(ShiftCopyWeekRequest request);
        Task<ShiftOperationResult> PublishAsync(ShiftPublishRequest request);
        Task<ShiftRequestDto?> CreateShiftRequestAsync(ShiftRequestCreateRequest request);
        Task<IEnumerable<ShiftRequestDto>> GetShiftRequestsAsync(int? storeId, string? status);
        Task<ShiftRequestDto?> ApproveShiftRequestAsync(int requestId, string? managerNote);
        Task<ShiftRequestDto?> RejectShiftRequestAsync(int requestId, string? managerNote);
    }
}
