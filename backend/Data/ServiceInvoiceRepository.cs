using backend.Entities;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class ServiceInvoiceRepository : IServiceInvoiceRepository
    {
        private readonly Auro2Context _context;

        public ServiceInvoiceRepository(Auro2Context context)
        {
            _context = context;
        }

        public async Task<PagedResult<ServiceInvoiceListItem>> GetInvoicesAsync(DateTime? fromDate, DateTime? toDate, string? customer, string? invoiceNumber, int pageNumber, int pageSize)
        {
            var query = _context.ServiceInvoices
                .AsNoTracking()
                .Include(i => i.Items)
                .AsQueryable();

            if (fromDate.HasValue)
            {
                query = query.Where(i => i.InvoiceDate >= fromDate.Value.Date);
            }

            if (toDate.HasValue)
            {
                query = query.Where(i => i.InvoiceDate <= toDate.Value.Date);
            }

            if (!string.IsNullOrWhiteSpace(customer))
            {
                query = query.Where(i => i.CustomerName.Contains(customer));
            }

            if (!string.IsNullOrWhiteSpace(invoiceNumber))
            {
                query = query.Where(i => i.InvoiceNumber.Contains(invoiceNumber));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(i => i.InvoiceDate)
                .ThenByDescending(i => i.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(i => new ServiceInvoiceListItem
                {
                    Id = i.Id,
                    InvoiceNumber = i.InvoiceNumber,
                    InvoiceDate = i.InvoiceDate,
                    DueDate = i.DueDate,
                    CustomerName = i.CustomerName,
                    TotalAmount = i.TotalAmount,
                    Currency = i.Currency,
                    Status = i.Status
                })
                .ToListAsync();

            return new PagedResult<ServiceInvoiceListItem>
            {
                Items = items,
                TotalCount = totalCount
            };
        }

        public async Task<ServiceInvoiceResponse?> GetInvoiceAsync(int id)
        {
            var invoice = await _context.ServiceInvoices
                .Include(i => i.Items)
                .AsNoTracking()
                .FirstOrDefaultAsync(i => i.Id == id);

            return invoice == null ? null : MapToResponse(invoice);
        }

        public async Task<ServiceInvoiceResponse> CreateInvoiceAsync(ServiceInvoiceRequest request)
        {
            var invoice = new ServiceInvoice
            {
                InvoiceNumber = string.IsNullOrWhiteSpace(request.InvoiceNumber)
                    ? await GenerateInvoiceNumberAsync(request.InvoiceDate)
                    : request.InvoiceNumber!,
                InvoiceDate = request.InvoiceDate.Date,
                DueDate = request.DueDate.Date,
                CustomerName = request.CustomerName,
                CustomerAddress = request.CustomerAddress,
                CustomerCity = request.CustomerCity,
                CustomerCountry = request.CustomerCountry,
                CustomerTaxId = request.CustomerTaxId,
                CustomerId = request.CustomerId,
                Currency = request.Currency,
                Notes = request.Notes,
                Status = request.Status ?? "Kreirano"
            };

            var items = request.Items.Select(MapToItemEntity).ToList();
            RecalculateTotals(invoice, items);

            invoice.Items = items;

            _context.ServiceInvoices.Add(invoice);
            await _context.SaveChangesAsync();

            return MapToResponse(invoice);
        }

        public async Task<ServiceInvoiceResponse?> UpdateInvoiceAsync(int id, ServiceInvoiceRequest request)
        {
            var invoice = await _context.ServiceInvoices
                .Include(i => i.Items)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null)
            {
                return null;
            }

            invoice.InvoiceNumber = string.IsNullOrWhiteSpace(request.InvoiceNumber)
                ? invoice.InvoiceNumber
                : request.InvoiceNumber!;
            invoice.InvoiceDate = request.InvoiceDate.Date;
            invoice.DueDate = request.DueDate.Date;
            invoice.CustomerName = request.CustomerName;
            invoice.CustomerAddress = request.CustomerAddress;
            invoice.CustomerCity = request.CustomerCity;
            invoice.CustomerCountry = request.CustomerCountry;
            invoice.CustomerTaxId = request.CustomerTaxId;
            invoice.CustomerId = request.CustomerId;
            invoice.Currency = request.Currency;
            invoice.Notes = request.Notes;
            invoice.Status = string.IsNullOrWhiteSpace(request.Status) ? invoice.Status : request.Status!;

            _context.ServiceInvoiceItems.RemoveRange(invoice.Items);
            var newItems = request.Items.Select(MapToItemEntity).ToList();
            RecalculateTotals(invoice, newItems);
            invoice.Items = newItems;
            _context.ServiceInvoiceItems.AddRange(newItems);

            await _context.SaveChangesAsync();

            return MapToResponse(invoice);
        }

        public async Task<bool> DeleteInvoiceAsync(int id)
        {
            var invoice = await _context.ServiceInvoices
                .Include(i => i.Items)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (invoice == null)
            {
                return false;
            }

            _context.ServiceInvoiceItems.RemoveRange(invoice.Items);
            _context.ServiceInvoices.Remove(invoice);
            await _context.SaveChangesAsync();
            return true;
        }

        private static ServiceInvoiceItem MapToItemEntity(ServiceInvoiceItemRequest request)
        {
            var lineTotalWithoutTax = Math.Round(request.Quantity * request.UnitPrice, 2);
            var lineTaxAmount = Math.Round(lineTotalWithoutTax * request.TaxRate / 100, 2);
            var lineTotalWithTax = Math.Round(lineTotalWithoutTax + lineTaxAmount, 2);

            return new ServiceInvoiceItem
            {
                Description = request.Description,
                Quantity = request.Quantity,
                UnitPrice = request.UnitPrice,
                TaxRate = request.TaxRate,
                LineTotalWithoutTax = lineTotalWithoutTax,
                LineTaxAmount = lineTaxAmount,
                LineTotalWithTax = lineTotalWithTax
            };
        }

        private static void RecalculateTotals(ServiceInvoice invoice, IEnumerable<ServiceInvoiceItem> items)
        {
            invoice.SubtotalAmount = Math.Round(items.Sum(i => i.LineTotalWithoutTax), 2);
            invoice.TaxAmount = Math.Round(items.Sum(i => i.LineTaxAmount), 2);
            invoice.TotalAmount = Math.Round(items.Sum(i => i.LineTotalWithTax), 2);
        }

        private async Task<string> GenerateInvoiceNumberAsync(DateTime invoiceDate)
        {
            var prefix = $"SI-{invoiceDate:yyyyMMdd}";

            var latestNumber = await _context.ServiceInvoices
                .Where(i => i.InvoiceNumber.StartsWith(prefix))
                .OrderByDescending(i => i.InvoiceNumber)
                .Select(i => i.InvoiceNumber)
                .FirstOrDefaultAsync();

            var nextNumber = 1;
            if (!string.IsNullOrWhiteSpace(latestNumber))
            {
                var parts = latestNumber.Split('-');
                if (parts.Length >= 3 && int.TryParse(parts[^1], out var lastSeq))
                {
                    nextNumber = lastSeq + 1;
                }
            }

            return $"{prefix}-{nextNumber:D4}";
        }

        private static ServiceInvoiceResponse MapToResponse(ServiceInvoice invoice)
        {
            return new ServiceInvoiceResponse
            {
                Id = invoice.Id,
                InvoiceNumber = invoice.InvoiceNumber,
                InvoiceDate = invoice.InvoiceDate,
                DueDate = invoice.DueDate,
                CustomerName = invoice.CustomerName,
                CustomerAddress = invoice.CustomerAddress,
                CustomerCity = invoice.CustomerCity,
                CustomerCountry = invoice.CustomerCountry,
                CustomerTaxId = invoice.CustomerTaxId,
                CustomerId = invoice.CustomerId,
                Currency = invoice.Currency,
                SubtotalAmount = invoice.SubtotalAmount,
                TaxAmount = invoice.TaxAmount,
                TotalAmount = invoice.TotalAmount,
                Notes = invoice.Notes,
                Status = invoice.Status,
                Items = invoice.Items.Select(i => new ServiceInvoiceItemResponse
                {
                    Id = i.Id,
                    Description = i.Description,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    TaxRate = i.TaxRate,
                    LineTotalWithoutTax = i.LineTotalWithoutTax,
                    LineTaxAmount = i.LineTaxAmount,
                    LineTotalWithTax = i.LineTotalWithTax
                }).ToList()
            };
        }
    }
}
