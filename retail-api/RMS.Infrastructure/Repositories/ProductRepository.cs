using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using RMS.Application.DTOs;
using RMS.Application.Interfaces;

namespace RMS.Infrastructure.Repositories
{
    public class ProductRepository
    {
        private readonly IApplicationDbContext _context;

        public ProductRepository(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<BarcodeScanResponse?> GetProductByScancodeAsync(string scancode)
        {
            var query = from bd in _context.BarcodeDetails
                        join pm in _context.ProductMasters on bd.BarcodeProductId equals pm.ProductId into pmGroup
                        from pm in pmGroup.DefaultIfEmpty()
                        join c in _context.Categories on pm.ProductCtId equals c.CategoryId into cGroup
                        from c in cGroup.DefaultIfEmpty()
                        join cl in _context.Colors on bd.BarcodeColorId equals cl.ColorId into clGroup
                        from cl in clGroup.DefaultIfEmpty()
                        join h in _context.Hsns on pm.ProductHsnId equals h.HsnId into hGroup
                        from h in hGroup.DefaultIfEmpty()
                        where bd.BarcodeDesc == scancode || bd.BarcodeSourceBarcode == scancode
                        orderby bd.BarcodeDesc == scancode ? 0 : 1
                        select new BarcodeScanResponse
                        {
                            Barcodedesc = bd.BarcodeDesc ?? "",
                            BarcodeSourceBarcode = bd.BarcodeSourceBarcode ?? "",
                            ProductCode = pm != null ? (pm.ProductCode ?? "") : "",
                            CategoryDescription = c != null ? (c.CategoryDescription ?? "") : "General",
                            ColorName = cl != null ? (cl.ColorName ?? "") : "N/A",
                            BarcodeSize = bd.BarcodeSize ?? "Free",
                            ProductIndividualBarcode = pm != null ? (pm.ProductIndividualBarcode == true ? "YES" : "NO") : "NO",
                            BarcodeMrp = bd.BarcodeMrp ?? 0,
                            BarcodeSelPrice = bd.BarcodeSelPrice ?? 0,
                            HsnId = pm != null ? pm.ProductHsnId : null,
                            HsnCode = h != null ? (h.HsnCode ?? "") : "",
                            BarcodeId = bd.BarcodeId ?? 0,
                            ProductNoStockChecking = pm != null ? (pm.ProductNoStockChecking == true) : false
                        };

            return await query.FirstOrDefaultAsync();
        }
    }
}

