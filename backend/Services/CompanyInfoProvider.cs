using backend.Models;
using Microsoft.Extensions.Options;

namespace backend.Services
{
    public interface ICompanyInfoProvider
    {
        CompanyInfoDto GetCompanyInfo();
    }

    public class CompanyInfoProvider : ICompanyInfoProvider
    {
        private readonly CompanyInfoOptions _options;

        public CompanyInfoProvider(IOptions<CompanyInfoOptions> options)
        {
            _options = options.Value;
        }

        public CompanyInfoDto GetCompanyInfo()
        {
            return new CompanyInfoDto
            {
                CompanyName = _options.CompanyName,
                Address = _options.Address,
                Jib = _options.Jib,
                PdvNumber = _options.PdvNumber,
                RegistrationNumber = _options.RegistrationNumber,
                Iban = _options.Iban,
                BankName = _options.BankName,
                Swift = _options.Swift,
                Phone = _options.Phone,
                Email = _options.Email,
                Web = _options.Web
            };
        }
    }
}
