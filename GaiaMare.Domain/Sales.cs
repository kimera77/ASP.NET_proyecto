using System.ComponentModel.DataAnnotations;

namespace GaiaMare.Domain;

public class Sale
{
    [Key]
    public int SaleId { get; set; }

    // Clave foránea hacia la tabla Inventory
    // Relación con el inventario (el ítem físico vendido)
    public int InventoryId { get; set; }

    // Propiedad de navegación: permite acceder al ítem de inventario vendido
    // Ejemplo: var productSold = sale.Inventory.Product.Name;
    public Inventory? Inventory { get; set; }

    public DateTime SaleDate { get; set; } = DateTime.Now;

    public decimal FinalPrice { get; set; }

    public string? PaymentMethod { get; set; }

    public decimal? DiscountApplied { get; set; }

    public int? ClientId { get; set; }
}
