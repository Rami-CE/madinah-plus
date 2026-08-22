using MadinahPlus.Domain.Entities;
using MadinahPlus.Domain.Interfaces;
using MadinahPlus.DataAccess.Persistence;
using Microsoft.EntityFrameworkCore;

namespace MadinahPlus.DataAccess.Repositories;

public class HousingRepository : IHousingRepository
{
    private readonly AppDbContext _db;
    public HousingRepository(AppDbContext db) => _db = db;

    public async Task<IReadOnlyList<HousingUnit>> GetAllAsync(CancellationToken ct = default) =>
        await Query().OrderBy(h => h.Id).ToListAsync(ct);

    public Task<HousingUnit?> GetByIdAsync(string id, CancellationToken ct = default) =>
        Query().FirstOrDefaultAsync(h => h.Id == id, ct);

    public Task UpdateAsync(HousingUnit unit, CancellationToken ct = default)
    {
        _db.HousingUnits.Update(unit);
        return Task.CompletedTask;
    }

    private IQueryable<HousingUnit> Query() =>
        _db.HousingUnits
            .Include(h => h.Facilities)
            .Include(h => h.Inspection).ThenInclude(c => c.Items);
}

public class BusinessRepository : IBusinessRepository
{
    private readonly AppDbContext _db;
    public BusinessRepository(AppDbContext db) => _db = db;

    public async Task<IReadOnlyList<Business>> GetAllAsync(CancellationToken ct = default) =>
        await _db.Businesses.Include(b => b.Criteria).OrderBy(b => b.Id).ToListAsync(ct);
}

public class RouteRepository : IRouteRepository
{
    private readonly AppDbContext _db;
    public RouteRepository(AppDbContext db) => _db = db;

    public async Task<IReadOnlyList<SafeRoute>> GetAllAsync(CancellationToken ct = default) =>
        await _db.SafeRoutes
            .Include(r => r.Path)
            .Include(r => r.Criteria)
            .OrderBy(r => r.Id)
            .ToListAsync(ct);
}

public class CityRepository : ICityRepository
{
    private readonly AppDbContext _db;
    public CityRepository(AppDbContext db) => _db = db;

    public Task<CityProfile?> GetProfileAsync(CancellationToken ct = default) =>
        _db.CityProfiles.Include(c => c.Dimensions).FirstOrDefaultAsync(ct);

    public async Task<IReadOnlyList<ImprovementPriority>> GetPrioritiesAsync(CancellationToken ct = default) =>
        await _db.ImprovementPriorities.OrderBy(p => p.Rank).ToListAsync(ct);

    public async Task<IReadOnlyList<MonitoringMetric>> GetMonitoringAsync(CancellationToken ct = default) =>
        await _db.MonitoringMetrics.ToListAsync(ct);
}

public class FeedbackRepository : IFeedbackRepository
{
    private readonly AppDbContext _db;
    public FeedbackRepository(AppDbContext db) => _db = db;

    public async Task<IReadOnlyList<FeedbackCategory>> GetCategoriesAsync(CancellationToken ct = default) =>
        await _db.FeedbackCategories.OrderBy(c => c.Key).ToListAsync(ct);

    public async Task<IReadOnlyList<StudentFeedback>> GetRecentAsync(CancellationToken ct = default) =>
        await _db.StudentFeedback.OrderByDescending(f => f.Date).ThenByDescending(f => f.Id).ToListAsync(ct);

    public async Task AddAsync(StudentFeedback feedback, CancellationToken ct = default) =>
        await _db.StudentFeedback.AddAsync(feedback, ct);
}

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;
    public UserRepository(AppDbContext db) => _db = db;

    public Task<AppUser?> GetByEmailAsync(string email, CancellationToken ct = default) =>
        _db.Users.FirstOrDefaultAsync(u => u.Email == email.Trim(), ct);

    public Task<AppUser?> GetByIdAsync(int id, CancellationToken ct = default) =>
        _db.Users.FirstOrDefaultAsync(u => u.Id == id, ct);

    public Task<bool> AnyAsync(CancellationToken ct = default) => _db.Users.AnyAsync(ct);

    public async Task AddAsync(AppUser user, CancellationToken ct = default) =>
        await _db.Users.AddAsync(user, ct);
}

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _db;
    public UnitOfWork(AppDbContext db) => _db = db;
    public Task<int> SaveChangesAsync(CancellationToken ct = default) => _db.SaveChangesAsync(ct);
}
