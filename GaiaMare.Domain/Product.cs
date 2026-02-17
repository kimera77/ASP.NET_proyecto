namespace GaiaMare.Domain;

public class Product
{
    public int ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? Color { get; set; }
    public string? Material { get; set; }
    public string? Size { get; set; }
    public string? Closure { get; set; }
    public string? Collection { get; set; }
    public decimal? Height { get; set; }
    public decimal? Width { get; set; }
    public string? InsideTexture { get; set; }
    public string? InsideColor { get; set; }
    public string? ImageUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
}