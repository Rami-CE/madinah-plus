using MadinahPlus.Domain.ValueObjects;

namespace MadinahPlus.Domain.Entities;

public class Business
{
    public string Id { get; set; } = default!;
    public LocalizedText Name { get; set; } = new();
    public LocalizedText Category { get; set; } = new();
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public bool Certified { get; set; }
    public ICollection<BusinessCriterion> Criteria { get; set; } = new List<BusinessCriterion>();
}

public class BusinessCriterion
{
    public int Id { get; set; }
    public string BusinessId { get; set; } = default!;
    public LocalizedText Label { get; set; } = new();
    public bool Met { get; set; }
    public int SortOrder { get; set; }
    public Business Business { get; set; } = default!;
}
