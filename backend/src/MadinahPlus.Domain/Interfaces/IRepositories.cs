using MadinahPlus.Domain.Entities;

namespace MadinahPlus.Domain.Interfaces;

public interface IHousingRepository
{
    Task<IReadOnlyList<HousingUnit>> GetAllAsync(CancellationToken ct = default);
    Task<HousingUnit?> GetByIdAsync(string id, CancellationToken ct = default);
    Task UpdateAsync(HousingUnit unit, CancellationToken ct = default);
}

public interface IBusinessRepository
{
    Task<IReadOnlyList<Business>> GetAllAsync(CancellationToken ct = default);
}

public interface IRouteRepository
{
    Task<IReadOnlyList<SafeRoute>> GetAllAsync(CancellationToken ct = default);
}

public interface ICityRepository
{
    Task<CityProfile?> GetProfileAsync(CancellationToken ct = default);
    Task<IReadOnlyList<ImprovementPriority>> GetPrioritiesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<MonitoringMetric>> GetMonitoringAsync(CancellationToken ct = default);
}

public interface IFeedbackRepository
{
    Task<IReadOnlyList<FeedbackCategory>> GetCategoriesAsync(CancellationToken ct = default);
    Task<IReadOnlyList<StudentFeedback>> GetRecentAsync(CancellationToken ct = default);
    Task AddAsync(StudentFeedback feedback, CancellationToken ct = default);
}

public interface IUserRepository
{
    Task<AppUser?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<AppUser?> GetByIdAsync(int id, CancellationToken ct = default);
    Task<bool> AnyAsync(CancellationToken ct = default);
    Task AddAsync(AppUser user, CancellationToken ct = default);
}

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
