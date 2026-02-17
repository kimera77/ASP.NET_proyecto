using GaiaMare.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace GaiaMare.Application
{
    // Capa de lógica de negocio para operaciones complejas sobre productos
    // Separa la lógica del controlador para mantener el código organizado
    public class ProductService
    {
        private readonly ApplicationDbContext _context;

        public ProductService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Verifica si un producto tiene stock disponible
        // Retorna true si existe al menos un ítem "In Stock" para ese producto
        public async Task<bool> HasStock(int productId)
        {
            return await _context.Inventory
                .AnyAsync(i => i.ProductId == productId && i.Status == "In Stock");
        }

        // Calcula el stock disponible de un producto específico
        // Cuenta cuántos ítems físicos están disponibles para la venta
        public async Task<int> GetAvailableStock(int productId)
        {
            return await _context.Inventory
                .CountAsync(i => i.ProductId == productId && i.Status == "In Stock");
        }

        // Calcula el precio promedio de una colección
        // Útil para análisis de precios y estrategias de venta
        public async Task<decimal> GetAveragePrice(string collection)
        {
            var products = await _context.Products
                .Where(p => p.Collection == collection)
                .ToListAsync();

            if (!products.Any())
                return 0;

            return products.Average(p => p.Price);
        }

        // Obtiene los productos con bajo stock (menos de 3 unidades)
        // Útil para alertas de reabastecimiento
        public async Task<List<(int ProductId, string Name, int Stock)>> GetLowStockProducts(int threshold = 3)
        {
            var products = await _context.Products.ToListAsync();
            var lowStock = new List<(int, string, int)>();

            foreach (var product in products)
            {
                var stock = await GetAvailableStock(product.ProductId);
                if (stock < threshold && stock > 0)
                {
                    lowStock.Add((product.ProductId, product.Name, stock));
                }
            }

            return lowStock;
        }
    }
}
