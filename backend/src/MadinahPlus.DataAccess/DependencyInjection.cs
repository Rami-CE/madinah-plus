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
        var connectionString = ResolveConnectionString(configuration)
            ?? throw new InvalidOperationException("Connection string 'PostgreSQL' (or DATABASE_URL) is missing.");

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

    /// <summary>
    /// Prefer DATABASE_URL when set (Railway/Neon/Render); else ConnectionStrings:PostgreSQL.
    /// </summary>
    public static string? ResolveConnectionString(IConfiguration configuration)
    {
        var databaseUrl = configuration["DATABASE_URL"]
            ?? Environment.GetEnvironmentVariable("DATABASE_URL");
        if (!string.IsNullOrWhiteSpace(databaseUrl))
            return ConvertDatabaseUrl(databaseUrl);

        var configured = configuration.GetConnectionString("PostgreSQL");
        return string.IsNullOrWhiteSpace(configured) ? null : configured;
    }

    internal static string ConvertDatabaseUrl(string databaseUrl)
    {
        if (!databaseUrl.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase)
            && !databaseUrl.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
            return databaseUrl;

        var uri = new Uri(databaseUrl);
        var userInfo = uri.UserInfo.Split(':', 2);
        var username = Uri.UnescapeDataString(userInfo[0]);
        var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : string.Empty;
        var database = Uri.UnescapeDataString(uri.AbsolutePath.TrimStart('/'));
        var port = uri.IsDefaultPort ? 5432 : uri.Port;
        var isPrivate = uri.Host.Contains("railway.internal", StringComparison.OrdinalIgnoreCase)
            || uri.Host is "localhost" or "127.0.0.1";
        var sslMode = isPrivate ? "Disable" : "Require";

        return string.Join(';',
            $"Host={uri.Host}",
            $"Port={port}",
            $"Database={database}",
            $"Username={username}",
            $"Password={password}",
            $"SSL Mode={sslMode}",
            "Trust Server Certificate=true");
    }
}
