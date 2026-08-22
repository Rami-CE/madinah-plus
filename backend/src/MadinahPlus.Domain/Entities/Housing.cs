using MadinahPlus.Domain.Enums;
using MadinahPlus.Domain.ValueObjects;

namespace MadinahPlus.Domain.Entities;

public class HousingUnit
{
    public string Id { get; set; } = default!;
    public LocalizedText Name { get; set; } = new();
    public LocalizedText Provider { get; set; } = new();
    public DateOnly? LastInspection { get; set; }
    public DateOnly? CertifiedDate { get; set; }
    public DateOnly? ExpiryDate { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public LocalizedText Price { get; set; } = new();
    public LocalizedText Distance { get; set; } = new();
    public int Score { get; set; }
    public CertificationStatus Status { get; set; }
    public bool ConditionalIssued { get; set; }

    public ICollection<HousingFacility> Facilities { get; set; } = new List<HousingFacility>();
    public ICollection<InspectionCategory> Inspection { get; set; } = new List<InspectionCategory>();
}

public class HousingFacility
{
    public int Id { get; set; }
    public string HousingUnitId { get; set; } = default!;
    public LocalizedText Name { get; set; } = new();
    public HousingUnit HousingUnit { get; set; } = default!;
}

public class InspectionCategory
{
    public int Id { get; set; }
    public string HousingUnitId { get; set; } = default!;
    public string Key { get; set; } = default!;
    public int SortOrder { get; set; }
    public LocalizedText Label { get; set; } = new();
    public HousingUnit HousingUnit { get; set; } = default!;
    public ICollection<InspectionItem> Items { get; set; } = new List<InspectionItem>();
}

public class InspectionItem
{
    public int Id { get; set; }
    public int InspectionCategoryId { get; set; }
    public string Key { get; set; } = default!;
    public int SortOrder { get; set; }
    public LocalizedText Label { get; set; } = new();
    public InspectionItemStatus Status { get; set; }
    public InspectionCategory Category { get; set; } = default!;
}
