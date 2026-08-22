namespace MadinahPlus.Domain.ValueObjects;

public sealed class LocalizedText
{
    public string Ar { get; set; } = string.Empty;
    public string En { get; set; } = string.Empty;

    public LocalizedText() { }

    public LocalizedText(string ar, string en)
    {
        Ar = ar;
        En = en;
    }

    public string For(string lang) =>
        lang.Equals("en", StringComparison.OrdinalIgnoreCase) ? En : Ar;
}
