using MadinahPlus.Domain.Enums;
using MadinahPlus.Domain.ValueObjects;

namespace MadinahPlus.Domain.Entities;

public class SafeRoute
{
    public string Id { get; set; } = default!;
    public LocalizedText Name { get; set; } = new();
    public LocalizedText Label { get; set; } = new();
    public LocalizedText From { get; set; } = new();
    public LocalizedText Via { get; set; } = new();
    public LocalizedText To { get; set; } = new();
    public CertificationStatus Status { get; set; }
    public ICollection<RoutePoint> Path { get; set; } = new List<RoutePoint>();
    public ICollection<RouteCriterion> Criteria { get; set; } = new List<RouteCriterion>();
}

public class RoutePoint
{
    public int Id { get; set; }
    public string SafeRouteId { get; set; } = default!;
    public int SortOrder { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public SafeRoute SafeRoute { get; set; } = default!;
}

public class RouteCriterion
{
    public int Id { get; set; }
    public string SafeRouteId { get; set; } = default!;
    public LocalizedText Label { get; set; } = new();
    public bool Met { get; set; }
    public int SortOrder { get; set; }
    public SafeRoute SafeRoute { get; set; } = default!;
}
