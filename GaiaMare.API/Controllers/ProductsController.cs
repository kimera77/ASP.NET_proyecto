using GaiaMare.Domain;
using GaiaMare.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GaiaMare.Application;

namespace GairaMare.API.Controllers
{
    // Esta etiqueta define que la URL será: https://localhost:7230/api/products
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ProductService _productService;

        // Inyección de Dependencias: Le pedimos a la API que nos pase el acceso a la DB
        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
            _productService = new ProductService(context);
        }

        // Acción GET: Retorna la lista de productos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            // Va a SQL Server, consulta la tabla y trae los resultados
            return await _context.Products.ToListAsync();
        }

        // GET: api/products/stock
        [HttpGet("stock")]
        public async Task<ActionResult<IEnumerable<ProductStockDto>>> GetProductsWithStock()
        {
            var productsWithStock = await _context.Products
                .Select(p => new ProductStockDto
                {
                    ProductId = p.ProductId,
                    Name = p.Name,
                    Price = p.Price,
                    ImageUrl = p.ImageUrl,
                    TotalStock = _context.Inventory.Count(i => i.ProductId == p.ProductId && i.Status == "Stock")
                })
                .ToListAsync();

            return Ok(productsWithStock);
        }

        // GET: api/products/filter?collection=Verano&material=Piel
        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<Product>>> GetFilteredProducts(
            [FromQuery] string? collection,
            [FromQuery] string? material)
        {
            // Creamos la consulta base (todavía no va a la base de datos)
            var query = _context.Products.AsQueryable();

            // Si el usuario envió una colección, filtramos
            if (!string.IsNullOrEmpty(collection))
            {
                query = query.Where(p => p.Collection == collection);
            }

            // Si el usuario envió un material, filtramos también
            if (!string.IsNullOrEmpty(material))
            {
                query = query.Where(p => p.Material == material);
            }

            // Ahora sí, ejecutamos la consulta en SQL
            var result = await query.ToListAsync();

            return Ok(result);
        }

        // POST: api/products
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct([FromBody] ProductCreateDto dto)
        {
            // Compatibilidad: Si viene "price" pero no "basePrice", copiar el valor
            if (dto.BasePrice <= 0 && dto.Price > 0)
                dto.BasePrice = dto.Price;

            // Validar que tenga nombre y basePrice
            if (string.IsNullOrWhiteSpace(dto.Name) || dto.BasePrice <= 0)
                return BadRequest("Nombre y precio base son obligatorios");

            // Igualar Price a BasePrice si no viene
            if (dto.Price <= 0)
                dto.Price = dto.BasePrice;

            var product = await _productService.AddProductAsync(dto);
            return CreatedAtAction(nameof(GetProducts), new { id = product.ProductId }, product);
        }
    }
}