namespace backend.Models
{
    public class DailyTaskOperationResult
    {
        public bool Success { get; private set; }
        public string? Error { get; private set; }
        public DailyTaskDto? Task { get; private set; }

        public static DailyTaskOperationResult Failed(string error)
        {
            return new DailyTaskOperationResult
            {
                Success = false,
                Error = error
            };
        }

        public static DailyTaskOperationResult Ok(DailyTaskDto task)
        {
            return new DailyTaskOperationResult
            {
                Success = true,
                Task = task
            };
        }
    }
}
