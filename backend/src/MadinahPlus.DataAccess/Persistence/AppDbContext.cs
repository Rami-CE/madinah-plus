using MadinahPlus.Domain.Entities;
using MadinahPlus.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace MadinahPlus.DataAccess.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<HousingUnit> HousingUnits => Set<HousingUnit>();
    public DbSet<HousingFacility> HousingFacilities => Set<HousingFacility>();
    public DbSet<InspectionCategory> InspectionCategories => Set<InspectionCategory>();
    public DbSet<InspectionItem> InspectionItems => Set<InspectionItem>();
    public DbSet<Business> Businesses => Set<Business>();
    public DbSet<BusinessCriterion> BusinessCriteria => Set<BusinessCriterion>();
    public DbSet<SafeRoute> SafeRoutes => Set<SafeRoute>();
    public DbSet<RoutePoint> RoutePoints => Set<RoutePoint>();
    public DbSet<RouteCriterion> RouteCriteria => Set<RouteCriterion>();
    public DbSet<CityProfile> CityProfiles => Set<CityProfile>();
    public DbSet<CityDimension> CityDimensions => Set<CityDimension>();
    public DbSet<ImprovementPriority> ImprovementPriorities => Set<ImprovementPriority>();
    public DbSet<MonitoringMetric> MonitoringMetrics => Set<MonitoringMetric>();
    public DbSet<FeedbackCategory> FeedbackCategories => Set<FeedbackCategory>();
    public DbSet<StudentFeedback> StudentFeedback => Set<StudentFeedback>();
    public DbSet<AppUser> Users => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<HousingUnit>(e =>
        {
            e.ToTable("housing_units");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(32);
            OwnLocalized(e.OwnsOne(x => x.Name), "name");
            OwnLocalized(e.OwnsOne(x => x.Provider), "provider");
            OwnLocalized(e.OwnsOne(x => x.Price), "price");
            OwnLocalized(e.OwnsOne(x => x.Distance), "distance");
            e.HasMany(x => x.Facilities).WithOne(x => x.HousingUnit).HasForeignKey(x => x.HousingUnitId).OnDelete(DeleteBehavior.Cascade);
            e.HasMany(x => x.Inspection).WithOne(x => x.HousingUnit).HasForeignKey(x => x.HousingUnitId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<HousingFacility>(e =>
        {
            e.ToTable("housing_facilities");
            e.HasKey(x => x.Id);
            OwnLocalized(e.OwnsOne(x => x.Name), "name");
        });

        modelBuilder.Entity<InspectionCategory>(e =>
        {
            e.ToTable("inspection_categories");
            e.HasKey(x => x.Id);
            e.Property(x => x.Key).HasMaxLength(64);
            OwnLocalized(e.OwnsOne(x => x.Label), "label");
            e.HasMany(x => x.Items).WithOne(x => x.Category).HasForeignKey(x => x.InspectionCategoryId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<InspectionItem>(e =>
        {
            e.ToTable("inspection_items");
            e.HasKey(x => x.Id);
            e.Property(x => x.Key).HasMaxLength(64);
            OwnLocalized(e.OwnsOne(x => x.Label), "label");
        });

        modelBuilder.Entity<Business>(e =>
        {
            e.ToTable("businesses");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(32);
            OwnLocalized(e.OwnsOne(x => x.Name), "name");
            OwnLocalized(e.OwnsOne(x => x.Category), "category");
            e.HasMany(x => x.Criteria).WithOne(x => x.Business).HasForeignKey(x => x.BusinessId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<BusinessCriterion>(e =>
        {
            e.ToTable("business_criteria");
            e.HasKey(x => x.Id);
            OwnLocalized(e.OwnsOne(x => x.Label), "label");
        });

        modelBuilder.Entity<SafeRoute>(e =>
        {
            e.ToTable("safe_routes");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(32);
            OwnLocalized(e.OwnsOne(x => x.Name), "name");
            OwnLocalized(e.OwnsOne(x => x.Label), "label");
            OwnLocalized(e.OwnsOne(x => x.From), "from_point");
            OwnLocalized(e.OwnsOne(x => x.Via), "via_point");
            OwnLocalized(e.OwnsOne(x => x.To), "to_point");
            e.HasMany(x => x.Path).WithOne(x => x.SafeRoute).HasForeignKey(x => x.SafeRouteId).OnDelete(DeleteBehavior.Cascade);
            e.HasMany(x => x.Criteria).WithOne(x => x.SafeRoute).HasForeignKey(x => x.SafeRouteId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<RoutePoint>(e =>
        {
            e.ToTable("route_points");
            e.HasKey(x => x.Id);
        });

        modelBuilder.Entity<RouteCriterion>(e =>
        {
            e.ToTable("route_criteria");
            e.HasKey(x => x.Id);
            OwnLocalized(e.OwnsOne(x => x.Label), "label");
        });

        modelBuilder.Entity<CityProfile>(e =>
        {
            e.ToTable("city_profiles");
            e.HasKey(x => x.Id);
            OwnLocalized(e.OwnsOne(x => x.Name), "name");
            OwnLocalized(e.OwnsOne(x => x.Tagline), "tagline");
            e.HasMany(x => x.Dimensions).WithOne(x => x.CityProfile).HasForeignKey(x => x.CityProfileId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<CityDimension>(e =>
        {
            e.ToTable("city_dimensions");
            e.HasKey(x => x.Id);
            e.Property(x => x.Key).HasMaxLength(64);
            OwnLocalized(e.OwnsOne(x => x.Label), "label");
            OwnLocalized(e.OwnsOne(x => x.Problems), "problems");
        });

        modelBuilder.Entity<ImprovementPriority>(e =>
        {
            e.ToTable("improvement_priorities");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(32);
            OwnLocalized(e.OwnsOne(x => x.Text), "text");
            OwnLocalized(e.OwnsOne(x => x.Impact), "impact");
            OwnLocalized(e.OwnsOne(x => x.Action), "action");
        });

        modelBuilder.Entity<MonitoringMetric>(e =>
        {
            e.ToTable("monitoring_metrics");
            e.HasKey(x => x.Id);
            e.Property(x => x.Key).HasMaxLength(64);
        });

        modelBuilder.Entity<FeedbackCategory>(e =>
        {
            e.ToTable("feedback_categories");
            e.HasKey(x => x.Key);
            e.Property(x => x.Key).HasMaxLength(64);
            OwnLocalized(e.OwnsOne(x => x.Label), "label");
        });

        modelBuilder.Entity<StudentFeedback>(e =>
        {
            e.ToTable("student_feedback");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasMaxLength(32);
            OwnLocalized(e.OwnsOne(x => x.Text), "text");
            OwnLocalized(e.OwnsOne(x => x.LinkedTo), "linked_to");
            e.HasOne(x => x.Category).WithMany().HasForeignKey(x => x.CategoryKey);
        });

        modelBuilder.Entity<AppUser>(e =>
        {
            e.ToTable("users");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.Name).HasColumnName("name").HasMaxLength(200);
            e.Property(x => x.Email).HasColumnName("email").HasMaxLength(256);
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.PasswordHash).HasColumnName("password_hash").HasMaxLength(500);
            e.Property(x => x.Role).HasColumnName("role");
        });
    }

    private static void OwnLocalized<T>(OwnedNavigationBuilder<T, LocalizedText> owned, string prefix)
        where T : class
    {
        owned.Property(x => x.Ar).HasColumnName($"{prefix}_ar").HasMaxLength(1000);
        owned.Property(x => x.En).HasColumnName($"{prefix}_en").HasMaxLength(1000);
    }
}
