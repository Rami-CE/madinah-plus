using MadinahPlus.Domain.Contracts;
using MadinahPlus.Domain.Entities;
using MadinahPlus.Domain.Enums;
using MadinahPlus.Domain.Interfaces;

namespace MadinahPlus.Domain.Services;

public class HousingCertificationService
{
    private readonly IHousingRepository _housing;
    private readonly IUnitOfWork _uow;

    public HousingCertificationService(IHousingRepository housing, IUnitOfWork uow)
    {
        _housing = housing;
        _uow = uow;
    }

    public async Task<IReadOnlyList<HousingDto>> GetAllAsync(CancellationToken ct = default)
    {
        var items = await _housing.GetAllAsync(ct);
        return items.Select(HousingMapper.ToDto).ToList();
    }

    public async Task<HousingDto> GetByIdAsync(string id, CancellationToken ct = default)
    {
        var unit = await Require(id, ct);
        return HousingMapper.ToDto(unit);
    }

    public async Task<HousingDto> UpdateInspectionItemAsync(string id, string itemKey, InspectionItemStatus status, CancellationToken ct = default)
    {
        var unit = await Require(id, ct);
        var item = unit.Inspection.SelectMany(c => c.Items).FirstOrDefault(i => i.Key == itemKey)
            ?? throw new KeyNotFoundException($"Inspection item '{itemKey}' was not found.");

        item.Status = status;
        InspectionScoringService.Recalculate(unit);
        await _housing.UpdateAsync(unit, ct);
        await _uow.SaveChangesAsync(ct);
        return HousingMapper.ToDto(unit);
    }

    public async Task<HousingDto> ApplyImprovementAsync(string id, CancellationToken ct = default)
    {
        var unit = await Require(id, ct);
        InspectionScoringService.MarkAllPassed(unit);
        await _housing.UpdateAsync(unit, ct);
        await _uow.SaveChangesAsync(ct);
        return HousingMapper.ToDto(unit);
    }

    public async Task<HousingDto> IssueCertificationAsync(string id, CancellationToken ct = default)
    {
        var unit = await Require(id, ct);
        InspectionScoringService.IssueCertification(unit);
        await _housing.UpdateAsync(unit, ct);
        await _uow.SaveChangesAsync(ct);
        return HousingMapper.ToDto(unit);
    }

    public async Task<HousingDto> IssueConditionalAsync(string id, CancellationToken ct = default)
    {
        var unit = await Require(id, ct);
        InspectionScoringService.IssueConditional(unit);
        await _housing.UpdateAsync(unit, ct);
        await _uow.SaveChangesAsync(ct);
        return HousingMapper.ToDto(unit);
    }

    private async Task<HousingUnit> Require(string id, CancellationToken ct)
    {
        return await _housing.GetByIdAsync(id, ct)
            ?? throw new KeyNotFoundException($"Housing '{id}' was not found.");
    }
}

public class CityDashboardService
{
    private readonly ICityRepository _city;
    private readonly IHousingRepository _housing;
    private readonly IBusinessRepository _businesses;
    private readonly IRouteRepository _routes;

    public CityDashboardService(
        ICityRepository city,
        IHousingRepository housing,
        IBusinessRepository businesses,
        IRouteRepository routes)
    {
        _city = city;
        _housing = housing;
        _businesses = businesses;
        _routes = routes;
    }

    public async Task<CityDto> GetCityAsync(CancellationToken ct = default)
    {
        var profile = await _city.GetProfileAsync(ct)
            ?? throw new InvalidOperationException("City profile is missing.");
        var dto = CityMapper.ToDto(profile);

        var housing = await _housing.GetAllAsync(ct);
        var businesses = await _businesses.GetAllAsync(ct);
        var routes = await _routes.GetAllAsync(ct);

        foreach (var dim in dto.Dimensions)
        {
            switch (dim.Key)
            {
                case "housing" when housing.Count > 0:
                    dim.Score = (int)Math.Round(housing.Average(h => h.Score));
                    dim.CertifiedCount = housing.Count(h => h.Status == CertificationStatus.Certified);
                    dim.TotalCount = housing.Count;
                    break;
                case "economy" when businesses.Count > 0:
                    dim.CertifiedCount = businesses.Count(b => b.Certified);
                    dim.TotalCount = businesses.Count;
                    break;
                case "safety" when routes.Count > 0:
                    dim.CertifiedCount = routes.Count(r => r.Status == CertificationStatus.Certified);
                    dim.TotalCount = routes.Count;
                    break;
            }
        }

        if (dto.Dimensions.Count > 0)
            dto.OverallScore = (int)Math.Round(dto.Dimensions.Average(d => d.Score));

        return dto;
    }

    public async Task<AccessibilityStatsDto> GetAccessibilityStatisticsAsync(CancellationToken ct = default)
    {
        var housing = await _housing.GetAllAsync(ct);
        var statuses = housing.Select(h => InspectionScoringService.DeriveAccessibilityStatus(
            h.Inspection.FirstOrDefault(c => c.Key == "accessibility"))).ToList();

        return new AccessibilityStatsDto
        {
            Accessible = statuses.Count(s => s == "Accessible"),
            PartiallyAccessible = statuses.Count(s => s == "PartiallyAccessible"),
            NotAccessible = statuses.Count(s => s == "NotAccessible"),
            NotAssessed = statuses.Count(s => s == "NotAssessed"),
            NeedImprovement = statuses.Count(s => s is "PartiallyAccessible" or "NotAccessible")
        };
    }

    public async Task<IReadOnlyList<PriorityDto>> GetPrioritiesAsync(CancellationToken ct = default)
    {
        var items = await _city.GetPrioritiesAsync(ct);
        return items.Select(CityMapper.ToDto).ToList();
    }

    public async Task<MonitoringDto> GetMonitoringAsync(CancellationToken ct = default)
    {
        var metrics = await _city.GetMonitoringAsync(ct);
        return CityMapper.ToMonitoring(metrics);
    }
}

public class CatalogService
{
    private readonly IHousingRepository _housing;
    private readonly IBusinessRepository _businesses;
    private readonly IRouteRepository _routes;

    public CatalogService(IHousingRepository housing, IBusinessRepository businesses, IRouteRepository routes)
    {
        _housing = housing;
        _businesses = businesses;
        _routes = routes;
    }

    public async Task<IReadOnlyList<BusinessDto>> GetBusinessesAsync(CancellationToken ct = default)
    {
        var items = await _businesses.GetAllAsync(ct);
        return items.Select(CatalogMapper.ToDto).ToList();
    }

    public async Task<IReadOnlyList<RouteDto>> GetRoutesAsync(CancellationToken ct = default)
    {
        var items = await _routes.GetAllAsync(ct);
        return items.Select(CatalogMapper.ToDto).ToList();
    }

    public async Task<IReadOnlyList<MapPinDto>> GetHousingPinsAsync(CancellationToken ct = default)
    {
        var items = await _housing.GetAllAsync(ct);
        return items.Select(h => new MapPinDto
        {
            Id = h.Id,
            Name = LocalizedDto.From(h.Name),
            Latitude = h.Latitude,
            Longitude = h.Longitude,
            Status = StatusCodec.Housing(h.Status),
            Score = h.Score,
            AccessibilityStatus = InspectionScoringService.DeriveAccessibilityStatus(
                h.Inspection.FirstOrDefault(c => c.Key == "accessibility")),
            AccessibilityScore = InspectionScoringService.ComputeCategoryScore(
                h.Inspection.FirstOrDefault(c => c.Key == "accessibility"))
        }).ToList();
    }

    public async Task<IReadOnlyList<MapPinDto>> GetBusinessPinsAsync(CancellationToken ct = default)
    {
        var items = await _businesses.GetAllAsync(ct);
        return items.Select(b => new MapPinDto
        {
            Id = b.Id,
            Name = LocalizedDto.From(b.Name),
            Latitude = b.Latitude,
            Longitude = b.Longitude,
            Status = b.Certified ? "CERTIFIED" : "NOT_CERTIFIED",
            Score = ScoreFromCriteria(b.Criteria.Select(c => c.Met))
        }).ToList();
    }

    public async Task<IReadOnlyList<MapRouteDto>> GetRoutePinsAsync(CancellationToken ct = default)
    {
        var items = await _routes.GetAllAsync(ct);
        return items.Select(r =>
        {
            var path = r.Path.OrderBy(p => p.SortOrder).Select(p => new[] { p.Latitude, p.Longitude }).ToList();
            var mid = path.Count == 0 ? new[] { 31.9733, 35.1964 } : path[path.Count / 2];
            return new MapRouteDto
            {
                Id = r.Id,
                Name = LocalizedDto.From(r.Name),
                Latitude = mid[0],
                Longitude = mid[1],
                Status = StatusCodec.Housing(r.Status),
                Score = ScoreFromCriteria(r.Criteria.Select(c => c.Met)),
                Path = path
            };
        }).ToList();
    }

    public async Task<IReadOnlyList<MapPinDto>> GetProblemPinsAsync(CancellationToken ct = default)
    {
        var housing = await GetHousingPinsAsync(ct);
        var routes = await GetRoutePinsAsync(ct);
        var problems = housing.Where(p => p.Status != "CERTIFIED").ToList();
        problems.AddRange(routes.Where(r => r.Status != "CERTIFIED").Select(r => new MapPinDto
        {
            Id = r.Id,
            Name = r.Name,
            Latitude = r.Latitude,
            Longitude = r.Longitude,
            Status = r.Status,
            Score = r.Score
        }));
        return problems;
    }

    private static int ScoreFromCriteria(IEnumerable<bool> met)
    {
        var list = met.ToList();
        return list.Count == 0 ? 0 : (int)Math.Round(100.0 * list.Count(m => m) / list.Count);
    }
}

public class FeedbackService
{
    private readonly IFeedbackRepository _feedback;
    private readonly IUnitOfWork _uow;

    public FeedbackService(IFeedbackRepository feedback, IUnitOfWork uow)
    {
        _feedback = feedback;
        _uow = uow;
    }

    public async Task<FeedbackPageDto> GetPageAsync(CancellationToken ct = default)
    {
        var categories = await _feedback.GetCategoriesAsync(ct);
        var log = await _feedback.GetRecentAsync(ct);
        return new FeedbackPageDto
        {
            Categories = categories.Select(c => new FeedbackCategoryDto
            {
                Key = c.Key,
                Label = LocalizedDto.From(c.Label)
            }).ToList(),
            Items = log.Select(FeedbackMapper.ToDto).ToList()
        };
    }

    public async Task<FeedbackDto> SubmitAsync(CreateFeedbackRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Text))
        {
            throw new ArgumentException("Feedback text is required.");
        }

        var categories = await _feedback.GetCategoriesAsync(ct);
        if (categories.All(c => c.Key != request.Category))
        {
            throw new ArgumentException("Unknown feedback category.");
        }

        var entity = new StudentFeedback
        {
            Id = $"f{Guid.NewGuid():N}"[..10],
            CategoryKey = request.Category,
            Text = new(request.Text, request.Text),
            LinkedTo = LinkFor(request.Category),
            Date = DateOnly.FromDateTime(DateTime.UtcNow)
        };

        await _feedback.AddAsync(entity, ct);
        await _uow.SaveChangesAsync(ct);
        return FeedbackMapper.ToDto(entity);
    }

    private static MadinahPlus.Domain.ValueObjects.LocalizedText LinkFor(string category) => category switch
    {
        "safety" => new("السلامة ← الإضاءة ← مسار ب", "Safety → Lighting → Route B"),
        "mobility" => new("التنقل ← الأرصفة ← الحرم الجامعي", "Mobility → Sidewalks → University campus"),
        "housing" => new("السكن ← التهوية ← سكن أبو قش", "Housing → Ventilation → Abu Qash Residence"),
        "business" => new("الاقتصاد الطلابي ← الأسعار ← محال البلدة", "Student Economy → Pricing → Town businesses"),
        "community" => new("المجتمع ← المشاركة ← أنشطة البلدية", "Community → Participation → Municipal activities"),
        _ => new("قيد المراجعة", "Under review")
    };
}
