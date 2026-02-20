# GaiaMare - Sistema de Gestión de Inventario

Sistema completo de gestión de productos e inventario de calzado con API REST (.NET 10) y frontend web (Angular 17).

---

## 🚀 Tecnologías

### Backend (API REST)
- **.NET 10** - Framework moderno de Microsoft para crear aplicaciones web de alto rendimiento
- **C# 14.0** - Lenguaje de programación orientado a objetos con características modernas
- **ASP.NET Core Web API** - Framework para crear APIs REST con endpoints HTTP
- **Entity Framework Core** - ORM (Object-Relational Mapper) para trabajar con bases de datos usando objetos C#
- **SQL Server** - Sistema de gestión de bases de datos relacional de Microsoft
- **Swagger UI** - Interfaz web interactiva para documentar y probar APIs automáticamente

### Frontend (Web App)
- **Angular 17** - Framework moderno para aplicaciones web SPA
- **TypeScript** - Superset tipado de JavaScript
- **Tailwind CSS v3** - Framework CSS utility-first para diseño rápido y responsive
- **RxJS** - Programación reactiva para manejo de datos asíncronos
- **Standalone Components** - Arquitectura moderna de Angular sin módulos

---

## ⚙️ Configuración

### Backend (.NET API)

1. **Configurar base de datos**
   - Actualiza la cadena de conexión en `GaiaMare.API/appsettings.json`:
     ```json
     "ConnectionStrings": {
       "DefaultConnection": "Server=localhost;Database=GaiaMareDB;Trusted_Connection=True;TrustServerCertificate=True;"
     }
     ```

2. **Crear base de datos**
   - Ejecuta el script SQL de `BBDD/TablasCreacion.sql` en SQL Server Management Studio

3. **Ejecutar la API**
   - Abre la solución en Visual Studio 2022
   - Presiona **F5** o ejecuta el proyecto `GaiaMare.API`
   - La API estará disponible en: `https://localhost:7230`
   - Swagger UI: `https://localhost:7230/swagger/index.html`

### Frontend (Angular)

1. **Instalar dependencias**
   ```bash
   cd gaia-mare-web
   npm install
   ```

2. **Ejecutar el servidor de desarrollo**
   ```bash
   ng serve
   ```
   - La aplicación estará disponible en: `http://localhost:4200`

3. **Ejecutar con HTTPS (opcional)**
   ```bash
   ng serve --configuration ssl
   ```
   - Requiere certificados SSL en la raíz del proyecto (`localhost.pem`, `localhost-key.pem`)

---

## 📡 Endpoints de la API

### Productos

**Obtener todos los productos**
```http
GET https://localhost:7230/api/products
```

**Crear nuevo producto**
```http
POST https://localhost:7230/api/products
Content-Type: application/json

{
  "name": "Bolso Tote Marrón",
  "basePrice": 89.99,
  "collection": "Verano",
  "material": "Piel",
  "color": "Marrón",
  "description": "Bolso espacioso de piel genuina",
  "imageUrl": "images/bolso-tote.jpg"
}
```
*Nota: Al crear un producto, automáticamente se crea 1 ítem en el inventario con estado "Stock"*

**Productos con stock e imágenes**
```http
GET https://localhost:7230/api/products/stock
```

**Filtrar productos por colección y material**
```http
GET https://localhost:7230/api/products/filter?collection=Verano&material=Piel
```

### Inventario

**Obtener inventario completo (con nombres de productos)**
```http
GET https://localhost:7230/api/inventory
```

**Añadir múltiples unidades al inventario**
```http
POST https://localhost:7230/api/inventory
Content-Type: application/json

{
  "productId": 2,
  "quantity": 5,
  "location": "Almacén Central - A1"
}
```
*Nota: Genera automáticamente SKUs únicos secuenciales (GAIA-0002-001, GAIA-0002-002, etc.)*

**Buscar por SKU**
```http
GET https://localhost:7230/api/inventory/sku/GAIA-0002-001
```

**Inventario por producto**
```http
GET https://localhost:7230/api/inventory/product/2
```

**Filtrar por estado**
```http
GET https://localhost:7230/api/inventory/filter?status=Stock
```

### Ventas

**Obtener todas las ventas**
```http
GET https://localhost:7230/api/sales
```

**Registrar una venta**
```http
POST https://localhost:7230/api/sales
Content-Type: application/json

{
  "inventoryId": 3,
  "finalPrice": 89.99,
  "paymentMethod": "Tarjeta",
  "discountApplied": 10.00,
  "clientId": 5
}
```
*Nota: Al registrar una venta, el estado del ítem de inventario cambia automáticamente a "Vendido"*

## 🏗️ Arquitectura del Proyecto

Este proyecto sigue el patrón **Arquitectura en Capas (Layered Architecture)** para separar responsabilidades y facilitar el mantenimiento.

```
┌─────────────────────────────────────────┐
│   🖥️  FRONTEND (Angular 17)             │
│   - Dashboard, Productos, Inventario    │
│   - Componentes standalone               │
│   - Tailwind CSS para estilos           │
│   http://localhost:4200                  │
└──────────────┬──────────────────────────┘
               │ HTTP Request (JSON)
               ▼
┌─────────────────────────────────────────┐
│  🎯 API LAYER (GaiaMare.API)            │
│  - ProductsController                    │ ← Controladores REST
│  - InventoryController                   │   Reciben peticiones HTTP
│  - SalesController                       │   Retornan JSON (camelCase)
│  - Program.cs (Configuración)           │
│  https://localhost:7230                  │
└──────────────┬──────────────────────────┘
               │ Inyección de Dependencias
               ▼
┌─────────────────────────────────────────┐
│  💼 APPLICATION LAYER                    │
│  (GaiaMare.Application)                  │
│  - ProductService                        │ ← Lógica de negocio
│  - Operaciones complejas                 │   Reutilizable
│  - Validaciones                          │   Testeable
└──────────────┬──────────────────────────┘
               │ Usa
               ▼
┌─────────────────────────────────────────┐
│  🗄️ INFRASTRUCTURE LAYER                │
│  (GaiaMare.Infrastructure)               │
│  - ApplicationDbContext                  │ ← Acceso a datos
│  - Configuración EF Core                 │   Comunicación con BD
│  - DbSet<Product, Inventory, Sale>      │
└──────────────┬──────────────────────────┘
               │ Mapea a
               ▼
┌─────────────────────────────────────────┐
│  📋 DOMAIN LAYER (GaiaMare.Domain)      │
│  - Product, Inventory, Sale              │ ← Entidades de negocio
│  - DTOs (ProductStockDto, etc.)         │   Sin dependencias
│  - Modelos puros                         │
└─────────────────────────────────────────┘
               │ Se persisten en
               ▼
┌─────────────────────────────────────────┐
│  💾 SQL SERVER DATABASE                 │
│  - Tabla Products                        │ ← Base de datos
│  - Tabla Inventory                       │   Persistencia
│  - Tabla Sales                           │
└─────────────────────────────────────────┘
```

### Estructura de Carpetas

```
GaiaMareApp/
├── GaiaMare.API/              → Controladores y configuración de la API
├── GaiaMare.Application/      → Lógica de negocio (ProductService)
├── GaiaMare.Domain/           → Modelos, entidades y DTOs
├── GaiaMare.Infrastructure/   → DbContext y configuración de EF Core
├── BBDD/                      → Scripts SQL
└── gaia-mare-web/             → Frontend Angular
    ├── src/
    │   ├── app/
    │   │   ├── components/    → Dashboard, Products, Inventory, Sales
    │   │   ├── services/      → HTTP services (ProductService, etc.)
    │   │   └── models/        → TypeScript interfaces
    │   └── styles.css         → Tailwind CSS
    ├── tailwind.config.js
    └── angular.json
```

---

## ✨ Características Implementadas

### Backend
✅ Arquitectura en capas  
✅ Inyección de dependencias  
✅ Entity Framework Core con SQL Server  
✅ DTOs para transferencia de datos segura  
✅ Serialización JSON en camelCase  
✅ CORS habilitado para frontends  
✅ Archivos estáticos (imágenes) desde `wwwroot/`  
✅ Swagger UI en modo desarrollo  
✅ Endpoints REST completos (GET, POST, filtros)

### Frontend
✅ Dashboard con KPIs en tiempo real  
✅ Gestión de productos con filtros  
✅ Control de inventario por SKU y estado  
✅ Registro de ventas  
✅ Diseño responsive (móvil, tablet, desktop)  
✅ Change Detection optimizado para datos dinámicos  
✅ Tailwind CSS para estilos modernos  
✅ Componentes standalone sin módulos

---

## 🎨 Capturas de Pantalla

### Dashboard
- Resumen general con KPIs
- Lista de productos con stock
- Datos actualizados en tiempo real

### Productos
- Catálogo con tarjetas visuales
- Filtros por colección y material
- Visualización de imágenes

### Inventario
- Control de stock por SKU
- Filtros por estado (Stock / Vendido)
- Búsqueda rápida

### Ventas
- Registro de nuevas ventas
- Selección de ítems disponibles
- Historial de ventas

---

## 🔧 Configuración Avanzada

### Gestión de Inventario con SKUs Automáticos

El sistema genera automáticamente SKUs únicos al crear productos o añadir stock:

**Formato de SKU:** `GAIA-{ProductID:4 dígitos}-{Secuencia:3 dígitos}`

**Ejemplos:**
- `GAIA-0002-001` → Primera unidad del producto 2
- `GAIA-0002-002` → Segunda unidad del producto 2
- `GAIA-0008-010` → Décima unidad del producto 8

**Flujo:**
1. **Crear producto** → Se crea automáticamente 1 ítem en inventario con SKU `GAIA-{ID}-001`
2. **Añadir stock** → El usuario especifica cantidad (ej: 5), el sistema genera 5 SKUs secuenciales
3. **Vender ítem** → El estado cambia de "Stock" a "Vendido"

### Literales de Estado del Inventario
- **`"Stock"`** → Disponible para venta
- **`"Vendido"`** → Ya vendido

Estos literales están configurados en:
- **Backend**: `ProductService.cs`, `SalesService.cs`, `InventoryController.cs`
- **Frontend**: `DashboardComponent.ts`, `InventoryComponent.ts`, `SalesComponent.ts`

### JSON camelCase
La API devuelve JSON en formato camelCase (`productId`, `totalStock`) configurado en `Program.cs`:
```csharp
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });
```

---

## 📝 Notas de Desarrollo

- **Change Detection**: Se usa `ChangeDetectorRef` en los componentes Angular para forzar la actualización de la vista cuando llegan datos asíncronos
- **HTTPS**: La API corre en `https://localhost:7230`, el frontend puede correr en HTTP o HTTPS
- **Imágenes**: Las imágenes se sirven desde `GaiaMare.API/wwwroot/images/`
- **CORS**: Habilitado en la API con política `AllowAll` para desarrollo

---

## 🚨 Troubleshooting

### "No se muestran datos en el frontend"
1. Verifica que la API esté corriendo en `https://localhost:7230`
2. Revisa la consola del navegador (F12) para errores HTTP
3. Comprueba que la base de datos tenga datos con `SELECT * FROM Products`

### "Error de CORS"
- Asegúrate de que `app.UseCors("AllowAll")` esté antes de `app.MapControllers()` en `Program.cs`

### "Tailwind CSS no funciona"
1. Verifica que `tailwind.config.js` existe en la raíz de `gaia-mare-web`
2. Reinicia `ng serve` completamente
3. Recarga el navegador sin caché: `Ctrl + Shift + R`

---

## 📚 Recursos Adicionales

- [Documentación de .NET](https://learn.microsoft.com/es-es/dotnet/)
- [Angular Documentation](https://angular.io/docs)
- [Entity Framework Core](https://learn.microsoft.com/es-es/ef/core/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 👨‍💻 Autor

Proyecto desarrollado para gestión de inventario de GaiaMare.

## 📄 Licencia

Este proyecto es privado y de uso interno.
