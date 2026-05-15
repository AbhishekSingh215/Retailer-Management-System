using Dapper;
using Microsoft.Data.SqlClient;
using RMS.Application.DTOs;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace RMS.Infrastructure.Repositories
{
    public class ProductRepository
    {
        private readonly string _connectionString;
        
        public ProductRepository(IConfiguration configuration) 
        {
            // Using the exact same connection string logic as your Program.cs
            _connectionString = "Server=STATICABHI;Database=RSOFT;Trusted_Connection=True;TrustServerCertificate=True";
        }

        public async Task<BarcodeScanResponse> GetProductByScancodeAsync(string scancode)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                const string sql = @"
                    SELECT TOP 1
                        bd.BarcodeDesc as Barcodedesc, 
                        bd.BarcodeSourceBarcode, 
                        pm.ProductCode, 
                        c.CategoryDescription,
                        cl.ColorName, 
                        bd.BarcodeSize, 
                        pm.ProductIndividualBarcode, 
                        bd.BarcodeMrp, 
                        bd.BarcodeSelPrice
                    FROM BarcodeDetails bd
                    LEFT JOIN ProductMaster pm ON pm.ProductId = bd.BarcodeProductId
                    LEFT JOIN Category c ON c.CategoryID = pm.ProductCtId
                    LEFT JOIN Colors cl ON cl.ColorId = bd.BarcodeColorId
                    WHERE bd.BarcodeDesc = @scancode OR bd.BarcodeSourceBarcode = @scancode
                    ORDER BY (CASE WHEN bd.BarcodeDesc = @scancode THEN 0 ELSE 1 END)";

                return await connection.QueryFirstOrDefaultAsync<BarcodeScanResponse>(sql, new { scancode });
            }
        }
    }
}
