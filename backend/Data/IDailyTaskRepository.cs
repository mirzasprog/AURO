using backend.Models;
using System.Threading.Tasks;

namespace backend.Data
{
    public interface IDailyTaskRepository
    {
        Task EnsureDailyTasksGeneratedAsync(int prodavnicaId, DateTime date);
        Task<IEnumerable<DailyTaskDto>> GetTasksForStoreAsync(int prodavnicaId, DateTime date, string? typeFilter = null);
        Task<IEnumerable<DailyTaskDto>> GetTasksForCurrentStoreAsync(DateTime date, string? typeFilter = null);
        Task<IEnumerable<DailyTaskDto>> GetTaskHistoryAsync(DateTime from, DateTime to, int? storeId, string? statusFilter = null, string? typeFilter = null);
        Task<DailyTaskOperationResult> UpdateTaskStatusAsync(int taskId, DailyTaskStatusUpdateRequest request);
        Task<DailyTaskOperationResult> CreateCustomTaskAsync(DailyTaskCreateRequest request);
        Task<DailyTaskBulkOperationResult> CreateBulkCustomTasksAsync(DailyTaskBulkCreateRequest request);
        Task<DailyTaskOperationResult> UpdateCustomTaskAsync(int taskId, DailyTaskUpdateRequest request);
        Task<IEnumerable<DailyTaskStoreDto>> GetStoresAsync();
    }
}
