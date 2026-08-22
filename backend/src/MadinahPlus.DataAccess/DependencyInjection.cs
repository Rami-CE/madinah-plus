using MadinahPlus.DataAccess.Persistence;
using MadinahPlus.DataAccess.Repositories;
using MadinahPlus.DataAccess.Seed;
using MadinahPlus.Domain.Interfaces;
using MadinahPlus.Domain.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace MadinahPlus.DataAccess;

public static class DependencyInjection
{
    public static IServiceCollection AddDataAccess(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("PostgreSQL")
            ?? throw new InvalidOperationException("Connection string 'PostgreSQL' is missing.");

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IHousingRepository, HousingRepository>();
        services.AddScoped<IBusinessRepository, BusinessRepository>();
        services.AddScoped<IRouteRepository, RouteRepository>();
        services.AddScoped<ICityRepository, CityRepository>();
        services.AddScoped<IFeedbackRepository, FeedbackRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        services.AddScoped<HousingCertificationService>();
        services.AddScoped<CityDashboardService>();
        services.AddScoped<CatalogService>();
        services.AddScoped<FeedbackService>();

        return services;
    }

    public static async Task InitializeDatabaseAsync(this IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await db.Database.MigrateAsync();
        await DemoDataSeeder.SeedAsync(db);
    }
}
