// Importa las funcionalidades de Entity Framework Core para trabajar con bases de datos
using Microsoft.EntityFrameworkCore;

// Crea el builder de la aplicación web - punto de entrada de la configuración
var builder = WebApplication.CreateBuilder(args);

// ========== CONFIGURACIÓN DE SERVICIOS ==========

// 1. Obtener la cadena de conexión del appsettings.json
// Lee la configuración "ConnectionStrings:DefaultConnection" del archivo appsettings.json
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Registrar el ApplicationDbContext en el contenedor de dependencias
// Esto permite que los controladores reciban automáticamente el contexto de BD
// UseSqlServer configura Entity Framework para usar SQL Server como proveedor de base de datos
builder.Services.AddDbContext<GaiaMare.Infrastructure.ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Registrar ProductService para inyección de dependencias
// Permite que los controladores usen la lógica de negocio de esta clase
// ⚠️ IMPORTANTE: Si da error al compilar, detén la depuración y vuelve a ejecutar Visual Studio
builder.Services.AddScoped<GaiaMare.Application.ProductService>();

// Registra los controladores de la API (ProductsController, InventoryController, SalesController)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Configura el serializador JSON para usar camelCase (estándar JavaScript)
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Habilita la documentación automática de endpoints para herramientas como Swagger
builder.Services.AddEndpointsApiExplorer();

// Configura Swagger para generar documentación interactiva de la API
builder.Services.AddSwaggerGen();

// Configura CORS (Cross-Origin Resource Sharing)
// Permite que aplicaciones web de otros dominios (frontend) puedan consumir esta API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()      // Permite peticiones desde cualquier origen
              .AllowAnyMethod()      // Permite GET, POST, PUT, DELETE, etc.
              .AllowAnyHeader();     // Permite cualquier cabecera HTTP
    });
});

// ========== CONSTRUCCIÓN DE LA APLICACIÓN ==========

// Construye la aplicación con todos los servicios configurados
var app = builder.Build();

// ========== CONFIGURACIÓN DEL PIPELINE HTTP ==========

// En modo desarrollo, habilita Swagger UI para probar los endpoints
if (app.Environment.IsDevelopment())
{
    // Expone el documento JSON de la API en /swagger/v1/swagger.json
    app.UseSwagger();

    // Habilita la interfaz web de Swagger en /swagger
    app.UseSwaggerUI();
}

// Habilita archivos estáticos (imágenes, CSS, JS) desde la carpeta wwwroot
// Ejemplo: wwwroot/images/bolso1.jpg será accesible en https://localhost:7230/images/bolso1.jpg
app.UseStaticFiles();

// Redirige automáticamente las peticiones HTTP a HTTPS
app.UseHttpsRedirection();

// Habilita CORS con la política "AllowAll" configurada arriba
// Debe ir antes de Authorization y MapControllers
app.UseCors("AllowAll");

// Habilita el sistema de autorización (aunque no está configurado aún)
app.UseAuthorization();

// Mapea los controladores para que respondan a las rutas definidas (api/products, api/inventory, api/sales)
app.MapControllers();

// Inicia la aplicación y comienza a escuchar peticiones HTTP
app.Run();
