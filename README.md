# GaiaMare API

API REST para gestión de productos e inventario de calzado.

## Tecnologías

- **.NET 10** - Framework moderno de Microsoft para crear aplicaciones web de alto rendimiento
- **C# 14.0** - Lenguaje de programación orientado a objetos con características modernas
- **ASP.NET Core Web API** - Framework para crear APIs REST con endpoints HTTP
- **Entity Framework Core** - ORM (Object-Relational Mapper) para trabajar con bases de datos usando objetos C#
- **SQL Server** - Sistema de gestión de bases de datos relacional de Microsoft
- **Swagger UI** - Interfaz web interactiva para documentar y probar APIs automáticamente
- **Dependency Injection** - Patrón de diseño para gestionar dependencias y hacer el código más testeable
- **Async/Await** - Programación asíncrona para mejorar el rendimiento de operaciones I/O
- **LINQ** - Language Integrated Query para consultas sobre colecciones de datos
- **DTOs (Data Transfer Objects)** - Objetos para transferir datos entre capas sin exponer entidades completas

## Configuración

1. Actualiza la cadena de conexión en `appsettings.json`
2. Ejecuta el script SQL de `BBDD/TablasCreacion.sql`
3. **Importante**: Detén la depuración en Visual Studio si está corriendo
4. Ejecuta el proyecto
5. Swagger UI: https://localhost:7230/swagger/index.html

## Endpoints

### Productos

**Obtener todos los productos**
```
GET https://localhost:7230/api/products
```

**Productos con stock e imágenes**
```
GET https://localhost:7230/api/products/stock
```

**Filtrar productos por colección y material**
```
GET https://localhost:7230/api/products/filter?collection=Verano&material=Piel
```

### Inventario

**Obtener inventario completo**
```
GET https://localhost:7230/api/inventory
```

**Buscar por SKU**
```
GET https://localhost:7230/api/inventory/sku/GAIA-TOTE-BRW-001
```

**Inventario por producto**
```
GET https://localhost:7230/api/inventory/product/1
```

**Filtrar por estado**
```
GET https://localhost:7230/api/inventory/filter?status=In Stock
```

### Ventas

**Registrar una venta**
```
POST https://localhost:7230/api/sales
Content-Type: application/json

{
  "inventoryId": 1,
  "finalPrice": 89.99,
  "paymentMethod": "Tarjeta",
  "discountApplied": 10.00,
  "clientId": 5
}
```

## Arquitectura del Proyecto

Este proyecto sigue el patrón **Arquitectura en Capas (Layered Architecture)** para separar responsabilidades y facilitar el mantenimiento.

```
┌─────────────────────────────────────────┐
│      FRONTEND (React, Angular, etc.)    │
│         Aplicación Cliente               │
└──────────────┬──────────────────────────┘
               │ HTTP Request (JSON)
               ▼
┌─────────────────────────────────────────┐
│  🎯 API LAYER (GaiaMare.API)            │
│  - ProductsController                    │ ← Controladores REST
│  - InventoryController                   │   Reciben peticiones HTTP
│  - SalesController                       │   Retornan respuestas JSON
│  - Program.cs (Configuración)           │
└──────────────┬──────────────────────────┘
               │ Inyección de Dependencias
               ▼
┌─────────────────────────────────────────┐
│  💼 APPLICATION LAYER (GaiaMare.Application) │
│  - ProductService                        │ ← Lógica de negocio
│  - Operaciones complejas                 │   Reutilizable
│  - Validaciones                          │   Testeable
└──────────────┬──────────────────────────┘
               │ Usa
               ▼
┌─────────────────────────────────────────┐
│  🗄️ INFRASTRUCTURE LAYER (GaiaMare.Infrastructure) │
│  - ApplicationDbContext                  │ ← Acceso a datos
│  - Configuración EF Core                 │   Comunicación con BD
│  - DbSet<Products, Inventory, Sales>    │
└──────────────┬──────────────────────────┘
               │ Mapea a
               ▼
┌─────────────────────────────────────────┐
│  📋 DOMAIN LAYER (GaiaMare.Domain)      │
│  - Product, Inventory, Sale              │ ← Entidades de negocio
│  - DTOs (ProductStockDto, SaleCreateDto)│   Sin dependencias
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
GaiaMare.API/              → Controladores y configuración de la API
GaiaMare.Application/      → Lógica de negocio (ProductService)
GaiaMare.Domain/           → Modelos, entidades y DTOs
GaiaMare.Infrastructure/   → DbContext y configuración de EF Core
BBDD/                      → Scripts SQL
```

## Características Implementadas

✅ Arquitectura en capas  
✅ Inyección de dependencias  
✅ Entity Framework Core con SQL Server  
✅ DTOs para transferencia de datos segura  
✅ Manejo básico de errores  
✅ Propiedades de navegación entre entidades  
✅ CORS habilitado para frontends  
✅ Archivos estáticos (imágenes) desde wwwroot/  
✅ Swagger UI en modo desarrollo  
✅ Comentarios educativos en el código

BBDD/                  → Scripts SQL
```
