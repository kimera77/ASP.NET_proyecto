using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GaiaMare.Domain;
using GaiaMare.Infrastructure;

namespace GaiaMare.API.Controllers
{
    // Define la ruta base del controlador: api/sales
    // [controller] se reemplaza automáticamente por el nombre del controlador (Sales)
    [Route("api/[controller]")]

    // Indica que esta clase es un controlador de API Web
    // Habilita validación automática de modelos, binding de parámetros y respuestas HTTP estándar
    [ApiController]
    public class SalesController : ControllerBase
    {
        // Campo privado y de solo lectura para acceder a la base de datos
        // ApplicationDbContext contiene las tablas Products, Inventory y Sales
        private readonly ApplicationDbContext _context;

        // Constructor: recibe el contexto de BD por Inyección de Dependencias
        // ASP.NET Core automáticamente pasa la instancia configurada en Program.cs
        public SalesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/sales
        // Endpoint para registrar una venta y actualizar el estado del inventario a "Sold"
        // Recibe los datos de la venta en el body de la petición (JSON)
        [HttpPost]
        public async Task<ActionResult<Sale>> PostSale([FromBody] SaleCreateDto saleDto)
        {
            // Validaciones básicas
            if (saleDto.FinalPrice <= 0)
                return BadRequest("El precio debe ser mayor a 0");

            try
            {
                // 1. Buscar el ítem en el inventario
                var inventoryItem = await _context.Inventory.FindAsync(saleDto.InventoryId);

                if (inventoryItem == null)
                    return NotFound($"El ítem de inventario ID {saleDto.InventoryId} no existe.");

                if (inventoryItem.Status == "Sold")
                    return Conflict("Este producto ya ha sido vendido.");

                // 2. Crear el registro de la venta
                var newSale = new Sale
                {
                    InventoryId = saleDto.InventoryId,
                    FinalPrice = saleDto.FinalPrice,
                    PaymentMethod = saleDto.PaymentMethod,
                    DiscountApplied = saleDto.DiscountApplied,
                    ClientId = saleDto.ClientId,
                    SaleDate = DateTime.Now
                };

                // 3. ACTUALIZAR EL ESTADO DEL INVENTARIO
                // Marca el ítem como vendido para que no aparezca en el stock disponible
                inventoryItem.Status = "Sold";

                // Guardamos ambos cambios en una sola transacción
                // Si algo falla, ningún cambio se guarda (atomicidad)
                _context.Sales.Add(newSale);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Venta registrada y stock actualizado", Sale = newSale });
            }
            catch (Exception ex)
            {
                // Captura cualquier error de base de datos o lógica
                return StatusCode(500, $"Error al procesar la venta: {ex.Message}");
            }
        }
    }
}