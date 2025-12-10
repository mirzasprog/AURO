using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ServiceInvoicesController : ControllerBase
    {
        private readonly IServiceInvoiceRepository _repository;
        private readonly ICompanyInfoProvider _companyInfoProvider;

        public ServiceInvoicesController(IServiceInvoiceRepository repository, ICompanyInfoProvider companyInfoProvider)
        {
            _repository = repository;
            _companyInfoProvider = companyInfoProvider;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<ServiceInvoiceListItem>>> GetInvoices([FromQuery] DateTime? datumOd, [FromQuery] DateTime? datumDo, [FromQuery] string? kupac, [FromQuery] string? brojFakture, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 20)
        {
            if (pageNumber <= 0 || pageSize <= 0)
            {
                return BadRequest(new { poruka = "Neispravan pageNumber ili pageSize." });
            }

            var result = await _repository.GetInvoicesAsync(datumOd, datumDo, kupac, brojFakture, pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceInvoiceResponse>> GetInvoice(int id)
        {
            var invoice = await _repository.GetInvoiceAsync(id);
            if (invoice == null)
            {
                return NotFound();
            }

            invoice.CompanyInfo = _companyInfoProvider.GetCompanyInfo();
            return Ok(invoice);
        }

        [HttpPost]
        [Authorize(Roles = "uprava,interna,podrucni,regionalni")]
        public async Task<ActionResult<ServiceInvoiceResponse>> CreateInvoice([FromBody] ServiceInvoiceRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (request.DueDate.Date < request.InvoiceDate.Date)
            {
                return BadRequest(new { poruka = "Datum dospijeća mora biti nakon datuma fakture." });
            }

            var created = await _repository.CreateInvoiceAsync(request);
            created.CompanyInfo = _companyInfoProvider.GetCompanyInfo();
            return CreatedAtAction(nameof(GetInvoice), new { id = created.Id }, created);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "uprava,interna,podrucni,regionalni")]
        public async Task<ActionResult<ServiceInvoiceResponse>> UpdateInvoice(int id, [FromBody] ServiceInvoiceRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (request.DueDate.Date < request.InvoiceDate.Date)
            {
                return BadRequest(new { poruka = "Datum dospijeća mora biti nakon datuma fakture." });
            }

            var updated = await _repository.UpdateInvoiceAsync(id, request);
            if (updated == null)
            {
                return NotFound();
            }

            updated.CompanyInfo = _companyInfoProvider.GetCompanyInfo();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "uprava")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            var deleted = await _repository.DeleteInvoiceAsync(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
