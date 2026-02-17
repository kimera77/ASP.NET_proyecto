namespace GaiaMare.Domain;

public class ProductStockDto
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public int TotalStock { get; set; } // Cantidad de ítems en Inventory
}