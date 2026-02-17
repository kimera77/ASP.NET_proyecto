namespace GaiaMare.Domain;

// DTO (Data Transfer Object) para crear una venta
// Se usa para recibir datos del cliente sin exponer toda la entidad Sale
public class SaleCreateDto
{
    // ID del ítem de inventario que se va a vender
    public int InventoryId { get; set; }

    // Precio final de la venta (puede incluir descuentos)
    public decimal FinalPrice { get; set; }

    // Método de pago: "Efectivo", "Tarjeta", "Transferencia", etc.
    public string PaymentMethod { get; set; } = string.Empty;

    // Descuento aplicado (opcional)
    public decimal? DiscountApplied { get; set; }

    // ID del cliente (opcional, si tienes sistema de clientes)
    public int? ClientId { get; set; }
}
