using backend.Models;

namespace backend.Data
{
    public interface IServiceInvoiceRepository
    {
        Task<PagedResult<ServiceInvoiceListItem>> GetInvoicesAsync(DateTime? fromDate, DateTime? toDate, string? customer, string? invoiceNumber, int pageNumber, int pageSize);
        Task<ServiceInvoiceResponse?> GetInvoiceAsync(int id);
        Task<ServiceInvoiceResponse> CreateInvoiceAsync(ServiceInvoiceRequest request);
        Task<ServiceInvoiceResponse?> UpdateInvoiceAsync(int id, ServiceInvoiceRequest request);
        Task<bool> DeleteInvoiceAsync(int id);
    }
}
