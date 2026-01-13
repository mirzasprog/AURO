namespace backend.Models.Shifts
{
    public class ShiftOperationResult
    {
        public bool Success { get; set; }
        public string? Error { get; set; }
        public string? Warning { get; set; }
        public ShiftDto? Shift { get; set; }

        public static ShiftOperationResult Failed(string error)
        {
            return new ShiftOperationResult { Success = false, Error = error };
        }

        public static ShiftOperationResult Ok(ShiftDto shift, string? warning = null)
        {
            return new ShiftOperationResult { Success = true, Shift = shift, Warning = warning };
        }
    }
}
