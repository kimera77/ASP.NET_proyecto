using System.ComponentModel.DataAnnotations;

namespace GaiaMare.Domain;

public class Inventory
{
    [Key]
    public int InventoryId { get; set; }

    // Clave foránea hacia la tabla Products
    public int ProductId { get; set; }

    // Propiedad de navegación: permite acceder al producto relacionado
    // Ejemplo: var productName = inventory.Product.Name;
    public Product? Product { get; set; }

    public string SKU { get; set; } = string.Empty;
    public string Status { get; set; } = "In Stock";
    public string? Location { get; set; }
    public DateTime ArrivalDate { get; set; } = DateTime.Now;
}
