using MadinahPlus.Domain.ValueObjects;

namespace MadinahPlus.Domain.Entities;

public class FeedbackCategory
{
    public string Key { get; set; } = default!;
    public LocalizedText Label { get; set; } = new();
}

public class StudentFeedback
{
    public string Id { get; set; } = default!;
    public string CategoryKey { get; set; } = default!;
    public LocalizedText Text { get; set; } = new();
    public LocalizedText LinkedTo { get; set; } = new();
    public DateOnly Date { get; set; }
    public FeedbackCategory? Category { get; set; }
}
