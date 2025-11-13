using backend.Models.Dashboard;
using System.Threading.Tasks;

namespace backend.Data
{
    public interface IDashboardRepository
    {
        Task<DashboardSummaryDto> GetDashboardSummaryAsync(int? prodavnicaId, DateTime date);
    }
}
