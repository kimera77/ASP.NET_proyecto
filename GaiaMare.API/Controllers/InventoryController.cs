using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GaiaMare.Domain;
using GaiaMare.Infrastructure;

namespace GaiaMare.API.Controllers
{
    // Controlador para gestionar el inventario físico de productos
    // Cada ítem en el inventario representa una unidad física individual
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InventoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/inventory
        // Obtiene toda la lista de ítems físicos del almacén
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Inventory>>> GetInventory()
        {
            return await _context.Inventory.ToListAsync();
        }

        // GET: api/inventory/sku/GAIA-TOTE-BRW-001
        // Busca un ítem específico por su código SKU único
        [HttpGet("sku/{sku}")]
        public async Task<ActionResult<Inventory>> GetBySku(string sku)
        {
            var item = await _context.Inventory
                .FirstOrDefaultAsync(i => i.SKU == sku);

            if (item == null) 
                return NotFound($"No se encontró el SKU: {sku}");

            return item;
        }

        // GET: api/inventory/product/1
        // Obtiene todos los ítems de inventario de un producto específico
        // Útil para ver cuántas unidades físicas existen de un diseño
        [HttpGet("product/{productId}")]
        public async Task<ActionResult<IEnumerable<Inventory>>> GetByProduct(int productId)
        {
            var items = await _context.Inventory
                .Where(i => i.ProductId == productId)
                .ToListAsync();

            if (!items.Any())
                return NotFound($"No hay inventario para el producto ID {productId}");

            return Ok(items);
        }

        // GET: api/inventory/filter?status=In Stock
        // Filtra el inventario por estado (In Stock, Sold, Reserved, Damaged, etc.)
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<Inventory>>> GetFilteredInventory(
            [FromQuery] string? status)
        {
            var query = _context.Inventory.AsQueryable();

            // Si se especifica un estado, filtra por ese estado
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(i => i.Status == status);
            }

            var result = await query.ToListAsync();

            return Ok(result);
        }
    }
}
