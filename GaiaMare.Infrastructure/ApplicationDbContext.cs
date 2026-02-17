using GaiaMare.Domain;
using Microsoft.EntityFrameworkCore;

namespace GaiaMare.Infrastructure;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Aquí registramos nuestras tablas. 
    // Por ahora solo la de Products, que es nuestro primer microservicio.
    public DbSet<Product> Products { get; set; }
    public DbSet<Inventory> Inventory { get; set; }
    public DbSet<Sale> Sales { get; set; } // Crea la clase Sale similar a las anteriores

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de precisión decimal para Product
        // Esto le dice a SQL que use 18 dígitos en total y 2 decimales
        modelBuilder.Entity<Product>()
            .Property(p => p.Width).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Product>()
            .Property(p => p.Height).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Product>()
            .Property(p => p.Price).HasColumnType("decimal(18,2)");

        // Configuración de precisión decimal para Sale
        // Importante para evitar errores de redondeo en precios y descuentos
        modelBuilder.Entity<Sale>()
            .Property(s => s.FinalPrice).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Sale>()
            .Property(s => s.DiscountApplied).HasColumnType("decimal(18,2)");
    }
}