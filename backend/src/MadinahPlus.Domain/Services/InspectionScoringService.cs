using MadinahPlus.Domain.Entities;
using MadinahPlus.Domain.Enums;

namespace MadinahPlus.Domain.Services;

public static class InspectionScoringService
{
    public static int Points(InspectionItemStatus status) => status switch
    {
        InspectionItemStatus.Pass => 100,
        InspectionItemStatus.Needs => 55,
        InspectionItemStatus.NotApplicable => 0,
        _ => 0
    };

    public static int ComputeScore(IEnumerable<InspectionCategory> categories)
    {
        var items = categories.SelectMany(c => c.Items)
            .Where(i => i.Status != InspectionItemStatus.NotApplicable)
            .ToList();
        if (items.Count == 0) return 0;
        return (int)Math.Round(items.Average(i => Points(i.Status)));
    }

    public static int ComputeCategoryScore(InspectionCategory? category)
    {
        if (category is null) return 0;
        var items = category.Items.Where(i => i.Status != InspectionItemStatus.NotApplicable).ToList();
        if (items.Count == 0) return 0;
        return (int)Math.Round(items.Average(i => Points(i.Status)));
    }

    public static string DeriveAccessibilityStatus(InspectionCategory? category)
    {
        if (category is null || category.Items.Count == 0) return "NotAssessed";
        var assessed = category.Items.Where(i => i.Status != InspectionItemStatus.NotApplicable).ToList();
        if (assessed.Count == 0) return "NotAssessed";

        var score = ComputeCategoryScore(category);
        var anyFail = assessed.Any(i => i.Status == InspectionItemStatus.Fail);
        var anyNeeds = assessed.Any(i => i.Status == InspectionItemStatus.Needs);

        if (!anyFail && !anyNeeds && score >= 85) return "Accessible";
        if (score >= 60) return "PartiallyAccessible";
        return "NotAccessible";
    }

    public static CertificationStatus DeriveStatus(int score)
    {
        if (score >= 85) return CertificationStatus.Certified;
        if (score >= 60) return CertificationStatus.Conditional;
        return CertificationStatus.NotCertified;
    }

    public static void Recalculate(HousingUnit unit)
    {
        unit.Score = ComputeScore(unit.Inspection);
        unit.Status = DeriveStatus(unit.Score);
    }

    public static void MarkAllPassed(HousingUnit unit)
    {
        foreach (var cat in unit.Inspection)
        {
            foreach (var item in cat.Items)
            {
                if (item.Status != InspectionItemStatus.NotApplicable)
                    item.Status = InspectionItemStatus.Pass;
            }
        }

        unit.LastInspection = DateOnly.FromDateTime(DateTime.UtcNow);
        Recalculate(unit);
    }

    public static void IssueCertification(HousingUnit unit)
    {
        Recalculate(unit);
        if (unit.Status != CertificationStatus.Certified)
        {
            throw new InvalidOperationException("Housing is not eligible for full certification.");
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        unit.CertifiedDate = today;
        unit.ExpiryDate = today.AddYears(1);
        unit.ConditionalIssued = false;
    }

    public static void IssueConditional(HousingUnit unit)
    {
        Recalculate(unit);
        if (unit.Status != CertificationStatus.Conditional)
        {
            throw new InvalidOperationException("Housing is not eligible for conditional certification.");
        }

        unit.ConditionalIssued = true;
    }
}
