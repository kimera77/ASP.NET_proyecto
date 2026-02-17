-- Clean up existing tables in correct order
DROP TABLE IF EXISTS Sales;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS Products;

-- 1. Products (The "DNA")
CREATE TABLE Products (
    ProductId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    BasePrice DECIMAL(18,2) NOT NULL,
    Color NVARCHAR(50),
    Material NVARCHAR(50),
    Size NVARCHAR(10),
    Closure NVARCHAR(50),
    Collection NVARCHAR(50),
    Height DECIMAL(10,2),
    Width DECIMAL(10,2),
    Price DECIMAL(18,2),
    InsideTexture NVARCHAR(100),
    InsideColor NVARCHAR(50),
    ImageUrl NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- 2. Inventory (Physical items)
CREATE TABLE Inventory (
    InventoryId INT PRIMARY KEY IDENTITY(1,1),
    ProductId INT NOT NULL,
    SKU NVARCHAR(50) UNIQUE NOT NULL,
    Status NVARCHAR(20) DEFAULT 'In Stock',
    Location NVARCHAR(100),
    ArrivalDate DATETIME DEFAULT GETDATE(),
    
    --CONSTRAINT FK_Inventory_Products FOREIGN KEY (ProductId) 
      --  REFERENCES Products(ProductId)
);

-- 3. Sales (Records)
CREATE TABLE Sales (
    SaleId INT PRIMARY KEY IDENTITY(1,1),
    InventoryId INT NOT NULL,
    SaleDate DATETIME DEFAULT GETDATE(),
    FinalPrice DECIMAL(18,2) NOT NULL,
    PaymentMethod NVARCHAR(50),
    DiscountApplied DECIMAL(18,2) DEFAULT NULL,
    ClientId INT,
    
    --CONSTRAINT FK_Sales_Inventory FOREIGN KEY (InventoryId) 
      --  REFERENCES Inventory(InventoryId)
);