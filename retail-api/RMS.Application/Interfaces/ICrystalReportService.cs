using System.Data;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace RMS.Application.Interfaces
{
    public interface ICrystalReportService
    {
        Task<byte[]> GenerateReportAsync(string rptName, DataTable mainData, Dictionary<string, DataTable>? subreports = null);
    }
}
