CREATE TABLE Products (
ProductId INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(500),
    PrecioBase DECIMAL(18,2) NOT NULL,
    Color NVARCHAR(50),      -- "Azul", "Negro"
    Material NVARCHAR(50),   -- "Piel", "Lona"
    Talla NVARCHAR(5),      -- "S", "M", "L", "XL"
    cierre NVARCHAR(50),    -- "Cremallera", "Velcro"
    Coleccion NVARCHAR(50),  -- "Invierno 2026"
    FechaCreacion DATETIME DEFAULT GETDATE()
);

CREATE TABLE Inventory (
    InventoryId INT PRIMARY KEY IDENTITY(1,1),
    ProductId INT NOT NULL, -- Relación con el ADN
    SKU NVARCHAR(50) UNIQUE NOT NULL, -- Código único para esa unidad exacta
    Estado NVARCHAR(20) DEFAULT 'En Stock', -- 'En Stock', 'Vendido', 'Reservado'
    Ubicacion NVARCHAR(100), -- Ej: 'Almacén Central', 'Estantería B4'
    FechaEntrada DATETIME DEFAULT GETDATE(),
    
    -- Esto crea el vínculo entre las dos tablas
    CONSTRAINT FK_Inventory_Products FOREIGN KEY (ProductId) 
        REFERENCES Products(ProductId)
);

CREATE TABLE Sales (
    SaleId INT PRIMARY KEY IDENTITY(1,1),
    InventoryId INT NOT NULL, -- Relación con la unidad física
    FechaVenta DATETIME DEFAULT GETDATE(),
    PrecioFinal DECIMAL(18,2) NOT NULL, -- El precio real de venta (por si hubo rebaja)
    MetodoPago NVARCHAR(50), -- 'Tarjeta', 'Efectivo', 'Bizum'
    HuboDescuento DECIMAL(18,2) DEFAULT null,
    ClienteId INT, 
    
    CONSTRAINT FK_Sales_Inventory FOREIGN KEY (InventoryId) 
        REFERENCES Inventory(InventoryId)
);
