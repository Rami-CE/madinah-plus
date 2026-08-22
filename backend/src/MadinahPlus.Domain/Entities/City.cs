using MadinahPlus.Domain.Enums;
using MadinahPlus.Domain.ValueObjects;

namespace MadinahPlus.Domain.Entities;

public class CityProfile
{
    public int Id { get; set; }
    public LocalizedText Name { get; set; } = new();
    public LocalizedText Tagline { get; set; } = new();
    public int OverallScore { get; set; }
    public double MapCenterLat { get; set; }
    public double MapCenterLng { get; set; }
    public ICollection<CityDimension> Dimensions { get; set; } = new List<CityDimension>();
}

public class CityDimension
{
    public int Id { get; set; }
    public int CityProfileId { get; set; }
    public string Key { get; set; } = default!;
    public LocalizedText Label { get; set; } = new();
    public int Score { get; set; }
    public int CertifiedCount { get; set; }
    public int TotalCount { get; set; }
    public LocalizedText Problems { get; set; } = new();
    public TrendDirection Trend { get; set; }
    public string Sparkline { get; set; } = string.Empty;
    public CityProfile CityProfile { get; set; } = default!;
}

public class ImprovementPriority
{
    public string Id { get; set; } = default!;
    public int Rank { get; set; }
    public PrioritySeverity Severity { get; set; }
    public string Dimension { get; set; } = default!;
    public LocalizedText Text { get; set; } = new();
    public LocalizedText Impact { get; set; } = new();
    public LocalizedText Action { get; set; } = new();
}

public class MonitoringMetric
{
    public int Id { get; set; }
    public string Key { get; set; } = default!;
    public int Before { get; set; }
    public int After { get; set; }
    public string Unit { get; set; } = "score";
}
