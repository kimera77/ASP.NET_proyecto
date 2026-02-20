namespace GaiaMare.Domain;

// DTO para crear nuevos ítems de inventario
public class InventoryCreateDto
{
    // ID del producto (diseño) al que pertenece
    public int ProductId { get; set; }

    // Cantidad de unidades a crear (genera múltiples SKUs automáticamente)
    public int Quantity { get; set; } = 1;

    // Estado inicial del ítem (por defecto "Stock")
    public string Status { get; set; } = "Stock";

    // Ubicación física en el almacén (opcional)
    public string? Location { get; set; }

    // Fecha de llegada del ítem al almacén
    public DateTime? ArrivalDate { get; set; }
}
