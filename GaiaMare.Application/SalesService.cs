using GaiaMare.Domain;
using GaiaMare.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace GaiaMare.Application;

public class SalesService
{
    private readonly ApplicationDbContext _context;

    public SalesService(ApplicationDbContext context)
    {
        _context = context;
    }

    // Lógica para registrar una venta y actualizar inventario
    public async Task<(bool Success, string? ErrorMessage, Sale? Sale)> AddSaleAsync(SaleCreateDto saleDto)
    {
        if (saleDto.FinalPrice <= 0)
            return (false, "El precio debe ser mayor a 0", null);

        var inventoryItem = await _context.Inventory.FindAsync(saleDto.InventoryId);
        if (inventoryItem == null)
            return (false, $"El ítem de inventario ID {saleDto.InventoryId} no existe.", null);
        if (inventoryItem.Status == "Vendido")
            return (false, "Este producto ya ha sido vendido.", null);

        var newSale = new Sale
        {
            InventoryId = saleDto.InventoryId,
            FinalPrice = saleDto.FinalPrice,
            PaymentMethod = saleDto.PaymentMethod,
            DiscountApplied = saleDto.DiscountApplied,
            ClientId = saleDto.ClientId,
            SaleDate = DateTime.Now
        };
        inventoryItem.Status = "Vendido";
        _context.Sales.Add(newSale);
        await _context.SaveChangesAsync();
        return (true, null, newSale);
    }
}
