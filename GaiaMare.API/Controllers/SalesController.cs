using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GaiaMare.Domain;
using GaiaMare.Infrastructure;
using GaiaMare.Application;

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
        private readonly SalesService _salesService;

        // Constructor: recibe el contexto de BD por Inyección de Dependencias
        // ASP.NET Core automáticamente pasa la instancia configurada en Program.cs
        public SalesController(ApplicationDbContext context)
        {
            _context = context;
            _salesService = new SalesService(context);
        }

        // GET: api/sales
        // Endpoint para obtener todas las ventas registradas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sale>>> GetSales()
        {
            var sales = await _context.Sales
                .Include(s => s.Inventory)
                .OrderByDescending(s => s.SaleDate)
                .ToListAsync();
            return Ok(sales);
        }

        // POST: api/sales
        // Endpoint para registrar una venta y actualizar el estado del inventario a "Sold"
        // Recibe los datos de la venta en el body de la petición (JSON)
        [HttpPost]
        public async Task<IActionResult> PostSale([FromBody] SaleCreateDto saleDto)
        {
            var (success, error, sale) = await _salesService.AddSaleAsync(saleDto);
            if (!success)
                return BadRequest(error);
            return Ok(new { Message = "Venta registrada y stock actualizado", Sale = sale });
        }
    }
}