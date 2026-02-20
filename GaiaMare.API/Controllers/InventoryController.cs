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
        // Obtiene toda la lista de ítems físicos del almacén con el nombre del producto
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetInventory()
        {
            var inventory = await _context.Inventory
                .Include(i => i.Product)
                .ToListAsync();

            var result = inventory.Select(i => new
            {
                i.InventoryId,
                i.ProductId,
                ProductName = i.Product?.Name ?? "Sin nombre",
                i.SKU,
                i.Status,
                i.Location,
                i.ArrivalDate
            });

            return Ok(result);
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
        // Filtra el inventario por estado con el nombre del producto
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<object>>> GetFilteredInventory(
            [FromQuery] string? status)
        {
            var query = _context.Inventory.Include(i => i.Product).AsQueryable();

            // Si se especifica un estado, filtra por ese estado
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(i => i.Status == status);
            }

            var inventory = await query.ToListAsync();

            var result = inventory.Select(i => new
            {
                i.InventoryId,
                i.ProductId,
                ProductName = i.Product?.Name ?? "Sin nombre",
                i.SKU,
                i.Status,
                i.Location,
                i.ArrivalDate
            });

            return Ok(result);
        }

        // POST: api/inventory
        // Crea uno o varios ítems físicos en el inventario según la cantidad especificada
        [HttpPost]
        public async Task<ActionResult<object>> PostInventory([FromBody] InventoryCreateDto dto)
        {
            // Validar que el producto existe
            var product = await _context.Products.FindAsync(dto.ProductId);
            if (product == null)
                return BadRequest($"El producto ID {dto.ProductId} no existe");

            // Validar cantidad
            if (dto.Quantity < 1)
                return BadRequest("La cantidad debe ser al menos 1");

            // Obtener el último SKU del producto para continuar la secuencia
            var lastSku = await _context.Inventory
                .Where(i => i.ProductId == dto.ProductId)
                .OrderByDescending(i => i.InventoryId)
                .Select(i => i.SKU)
                .FirstOrDefaultAsync();

            int startNumber = 1;
            if (!string.IsNullOrEmpty(lastSku))
            {
                // Extraer el número del último SKU (ej: GAIA-0002-005 → 5)
                var parts = lastSku.Split('-');
                if (parts.Length >= 3 && int.TryParse(parts[^1], out int lastNum))
                {
                    startNumber = lastNum + 1;
                }
            }

            var createdItems = new List<Inventory>();
            var arrivalDate = dto.ArrivalDate ?? DateTime.Now;

            // Crear múltiples ítems según la cantidad
            for (int i = 0; i < dto.Quantity; i++)
            {
                var sku = $"GAIA-{dto.ProductId:D4}-{(startNumber + i):D3}";

                var newItem = new Inventory
                {
                    ProductId = dto.ProductId,
                    SKU = sku,
                    Status = string.IsNullOrEmpty(dto.Status) ? "Stock" : dto.Status,
                    Location = dto.Location,
                    ArrivalDate = arrivalDate
                };

                _context.Inventory.Add(newItem);
                createdItems.Add(newItem);
            }

            await _context.SaveChangesAsync();

            return Ok(new 
            { 
                Message = $"{dto.Quantity} ítem(s) creado(s) correctamente",
                Count = createdItems.Count,
                Items = createdItems
            });
        }
    }
}
