using MadinahPlus.Domain.Entities;
using MadinahPlus.Domain.Enums;
using MadinahPlus.Domain.Services;
using MadinahPlus.Domain.ValueObjects;

namespace MadinahPlus.Domain.Contracts;

public class LocalizedDto
{
    public string Ar { get; set; } = string.Empty;
    public string En { get; set; } = string.Empty;

    public static LocalizedDto From(LocalizedText text) => new() { Ar = text.Ar, En = text.En };
}

public class HousingDto
{
    public string Id { get; set; } = default!;
    public LocalizedDto Name { get; set; } = new();
    public LocalizedDto Provider { get; set; } = new();
    public string? LastInspection { get; set; }
    public string? CertifiedDate { get; set; }
    public string? ExpiryDate { get; set; }
    public double Lat { get; set; }
    public double Lng { get; set; }
    public LocalizedDto Price { get; set; } = new();
    public LocalizedDto Distance { get; set; } = new();
    public int Score { get; set; }
    public string Status { get; set; } = default!;
    public bool ConditionalIssued { get; set; }
    public List<LocalizedDto> Facilities { get; set; } = new();
    public List<InspectionCategoryDto> Inspection { get; set; } = new();
    public AccessibilityDto Accessibility { get; set; } = new();
}

public class AccessibilityDto
{
    public string Status { get; set; } = "NotAssessed";
    public int Score { get; set; }
    public List<InspectionItemDto> Criteria { get; set; } = new();
}

public class AccessibilityStatsDto
{
    public int Accessible { get; set; }
    public int PartiallyAccessible { get; set; }
    public int NotAccessible { get; set; }
    public int NotAssessed { get; set; }
    public int NeedImprovement { get; set; }
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class AuthUserDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public AuthUserDto User { get; set; } = new();
}

public class InspectionCategoryDto
{
    public string Key { get; set; } = default!;
    public LocalizedDto Label { get; set; } = new();
    public List<InspectionItemDto> Items { get; set; } = new();
}

public class InspectionItemDto
{
    public string Key { get; set; } = default!;
    public LocalizedDto Label { get; set; } = new();
    public string Status { get; set; } = default!;
}

public class UpdateInspectionItemRequest
{
    public string Status { get; set; } = default!;
}

public class BusinessDto
{
    public string Id { get; set; } = default!;
    public LocalizedDto Name { get; set; } = new();
    public LocalizedDto Category { get; set; } = new();
    public double Lat { get; set; }
    public double Lng { get; set; }
    public bool Certified { get; set; }
    public List<CriterionDto> Criteria { get; set; } = new();
}

public class CriterionDto
{
    public LocalizedDto Label { get; set; } = new();
    public bool Met { get; set; }
}

public class RouteDto
{
    public string Id { get; set; } = default!;
    public LocalizedDto Name { get; set; } = new();
    public LocalizedDto Label { get; set; } = new();
    public LocalizedDto From { get; set; } = new();
    public LocalizedDto Via { get; set; } = new();
    public LocalizedDto To { get; set; } = new();
    public string Status { get; set; } = default!;
    public List<double[]> Path { get; set; } = new();
    public List<CriterionDto> Criteria { get; set; } = new();
}

public class CityDto
{
    public LocalizedDto Name { get; set; } = new();
    public LocalizedDto Tagline { get; set; } = new();
    public int OverallScore { get; set; }
    public double[] MapCenter { get; set; } = Array.Empty<double>();
    public List<DimensionDto> Dimensions { get; set; } = new();
}

public class DimensionDto
{
    public string Key { get; set; } = default!;
    public LocalizedDto Label { get; set; } = new();
    public int Score { get; set; }
    public int CertifiedCount { get; set; }
    public int TotalCount { get; set; }
    public LocalizedDto Problems { get; set; } = new();
    public string Trend { get; set; } = "flat";
    public List<int> Spark { get; set; } = new();
}

public class PriorityDto
{
    public string Id { get; set; } = default!;
    public int Rank { get; set; }
    public string Severity { get; set; } = default!;
    public string Dimension { get; set; } = default!;
    public LocalizedDto Text { get; set; } = new();
    public LocalizedDto Impact { get; set; } = new();
    public LocalizedDto Action { get; set; } = new();
}

public class MonitoringDto
{
    public MetricDto Housing { get; set; } = new();
    public MetricDto Lighting { get; set; } = new();
    public MetricDto CertifiedBusinesses { get; set; } = new();
}

public class MetricDto
{
    public int Before { get; set; }
    public int After { get; set; }
    public string Unit { get; set; } = "score";
}

public class FeedbackCategoryDto
{
    public string Key { get; set; } = default!;
    public LocalizedDto Label { get; set; } = new();
}

public class FeedbackDto
{
    public string Id { get; set; } = default!;
    public string Category { get; set; } = default!;
    public LocalizedDto Text { get; set; } = new();
    public LocalizedDto LinkedTo { get; set; } = new();
    public string Date { get; set; } = default!;
}

public class FeedbackPageDto
{
    public List<FeedbackCategoryDto> Categories { get; set; } = new();
    public List<FeedbackDto> Items { get; set; } = new();
}

public class CreateFeedbackRequest
{
    public string Category { get; set; } = default!;
    public string Text { get; set; } = default!;
}

public class MapPinDto
{
    public string Id { get; set; } = default!;
    public LocalizedDto Name { get; set; } = new();
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Status { get; set; } = default!;
    public int Score { get; set; }
    public string? AccessibilityStatus { get; set; }
    public int? AccessibilityScore { get; set; }
}

public class MapRouteDto
{
    public string Id { get; set; } = default!;
    public LocalizedDto Name { get; set; } = new();
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string Status { get; set; } = default!;
    public int Score { get; set; }
    public List<double[]> Path { get; set; } = new();
}

public static class StatusCodec
{
    public static string Housing(CertificationStatus status) => status switch
    {
        CertificationStatus.Certified => "CERTIFIED",
        CertificationStatus.Conditional => "CONDITIONAL",
        _ => "NOT_CERTIFIED"
    };

    public static string Item(InspectionItemStatus status) => status switch
    {
        InspectionItemStatus.Pass => "PASS",
        InspectionItemStatus.Needs => "NEEDS",
        InspectionItemStatus.NotApplicable => "NA",
        _ => "FAIL"
    };

    public static InspectionItemStatus ParseItem(string status) => status.ToUpperInvariant() switch
    {
        "PASS" => InspectionItemStatus.Pass,
        "NEEDS" => InspectionItemStatus.Needs,
        "FAIL" => InspectionItemStatus.Fail,
        "NA" or "N/A" or "NOT_APPLICABLE" or "NOTAPPLICABLE" => InspectionItemStatus.NotApplicable,
        _ => throw new ArgumentException($"Unknown inspection status '{status}'.")
    };

    public static string Severity(PrioritySeverity severity) => severity switch
    {
        PrioritySeverity.High => "high",
        PrioritySeverity.Medium => "medium",
        _ => "low"
    };

    public static string Trend(TrendDirection trend) => trend switch
    {
        TrendDirection.Up => "up",
        TrendDirection.Down => "down",
        _ => "flat"
    };

    public static string Iso(DateOnly? date) => date?.ToString("yyyy-MM-dd") ?? string.Empty;
}

public static class HousingMapper
{
    public static HousingDto ToDto(HousingUnit unit) => new()
    {
        Id = unit.Id,
        Name = LocalizedDto.From(unit.Name),
        Provider = LocalizedDto.From(unit.Provider),
        LastInspection = StatusCodec.Iso(unit.LastInspection),
        CertifiedDate = string.IsNullOrEmpty(StatusCodec.Iso(unit.CertifiedDate)) ? null : StatusCodec.Iso(unit.CertifiedDate),
        ExpiryDate = string.IsNullOrEmpty(StatusCodec.Iso(unit.ExpiryDate)) ? null : StatusCodec.Iso(unit.ExpiryDate),
        Lat = unit.Latitude,
        Lng = unit.Longitude,
        Price = LocalizedDto.From(unit.Price),
        Distance = LocalizedDto.From(unit.Distance),
        Score = unit.Score,
        Status = StatusCodec.Housing(unit.Status),
        ConditionalIssued = unit.ConditionalIssued,
        Facilities = unit.Facilities.Select(f => LocalizedDto.From(f.Name)).ToList(),
        Inspection = unit.Inspection
            .OrderBy(c => c.SortOrder)
            .Select(c => new InspectionCategoryDto
            {
                Key = c.Key,
                Label = LocalizedDto.From(c.Label),
                Items = c.Items.OrderBy(i => i.SortOrder).Select(i => new InspectionItemDto
                {
                    Key = i.Key,
                    Label = LocalizedDto.From(i.Label),
                    Status = StatusCodec.Item(i.Status)
                }).ToList()
            }).ToList(),
        Accessibility = AccessibilityOf(unit)
    };

    public static AccessibilityDto AccessibilityOf(HousingUnit unit)
    {
        var cat = unit.Inspection.FirstOrDefault(c => c.Key == "accessibility");
        return new AccessibilityDto
        {
            Status = InspectionScoringService.DeriveAccessibilityStatus(cat),
            Score = InspectionScoringService.ComputeCategoryScore(cat),
            Criteria = cat?.Items.OrderBy(i => i.SortOrder).Select(i => new InspectionItemDto
            {
                Key = i.Key,
                Label = LocalizedDto.From(i.Label),
                Status = StatusCodec.Item(i.Status)
            }).ToList() ?? []
        };
    }
}

public static class CatalogMapper
{
    public static BusinessDto ToDto(Business b) => new()
    {
        Id = b.Id,
        Name = LocalizedDto.From(b.Name),
        Category = LocalizedDto.From(b.Category),
        Lat = b.Latitude,
        Lng = b.Longitude,
        Certified = b.Certified,
        Criteria = b.Criteria.OrderBy(c => c.SortOrder).Select(c => new CriterionDto
        {
            Label = LocalizedDto.From(c.Label),
            Met = c.Met
        }).ToList()
    };

    public static RouteDto ToDto(SafeRoute r) => new()
    {
        Id = r.Id,
        Name = LocalizedDto.From(r.Name),
        Label = LocalizedDto.From(r.Label),
        From = LocalizedDto.From(r.From),
        Via = LocalizedDto.From(r.Via),
        To = LocalizedDto.From(r.To),
        Status = StatusCodec.Housing(r.Status),
        Path = r.Path.OrderBy(p => p.SortOrder).Select(p => new[] { p.Latitude, p.Longitude }).ToList(),
        Criteria = r.Criteria.OrderBy(c => c.SortOrder).Select(c => new CriterionDto
        {
            Label = LocalizedDto.From(c.Label),
            Met = c.Met
        }).ToList()
    };
}

public static class CityMapper
{
    public static CityDto ToDto(CityProfile p) => new()
    {
        Name = LocalizedDto.From(p.Name),
        Tagline = LocalizedDto.From(p.Tagline),
        OverallScore = p.OverallScore,
        MapCenter = new[] { p.MapCenterLat, p.MapCenterLng },
        Dimensions = p.Dimensions.Select(d => new DimensionDto
        {
            Key = d.Key,
            Label = LocalizedDto.From(d.Label),
            Score = d.Score,
            CertifiedCount = d.CertifiedCount,
            TotalCount = d.TotalCount,
            Problems = LocalizedDto.From(d.Problems),
            Trend = StatusCodec.Trend(d.Trend),
            Spark = string.IsNullOrWhiteSpace(d.Sparkline)
                ? new List<int>()
                : d.Sparkline.Split(',').Select(int.Parse).ToList()
        }).ToList()
    };

    public static PriorityDto ToDto(ImprovementPriority p) => new()
    {
        Id = p.Id,
        Rank = p.Rank,
        Severity = StatusCodec.Severity(p.Severity),
        Dimension = p.Dimension,
        Text = LocalizedDto.From(p.Text),
        Impact = LocalizedDto.From(p.Impact),
        Action = LocalizedDto.From(p.Action)
    };

    public static MonitoringDto ToMonitoring(IEnumerable<MonitoringMetric> metrics)
    {
        var map = metrics.ToDictionary(m => m.Key, StringComparer.OrdinalIgnoreCase);
        MetricDto Pick(string key) => map.TryGetValue(key, out var m)
            ? new MetricDto { Before = m.Before, After = m.After, Unit = m.Unit }
            : new MetricDto();

        return new MonitoringDto
        {
            Housing = Pick("housing"),
            Lighting = Pick("lighting"),
            CertifiedBusinesses = Pick("certifiedBusinesses")
        };
    }
}

public static class FeedbackMapper
{
    public static FeedbackDto ToDto(StudentFeedback f) => new()
    {
        Id = f.Id,
        Category = f.CategoryKey,
        Text = LocalizedDto.From(f.Text),
        LinkedTo = LocalizedDto.From(f.LinkedTo),
        Date = f.Date.ToString("yyyy-MM-dd")
    };
}
