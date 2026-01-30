namespace backend.Models
{
    public class DailyTaskBulkOperationResult
    {
        public bool Success { get; private set; }
        public string? Error { get; private set; }
        public int CreatedTasks { get; private set; }
        public int StoreCount { get; private set; }

        public static DailyTaskBulkOperationResult Failed(string error)
        {
            return new DailyTaskBulkOperationResult
            {
                Success = false,
                Error = error
            };
        }

        public static DailyTaskBulkOperationResult Ok(int createdTasks, int storeCount)
        {
            return new DailyTaskBulkOperationResult
            {
                Success = true,
                CreatedTasks = createdTasks,
                StoreCount = storeCount
            };
        }
    }
}
