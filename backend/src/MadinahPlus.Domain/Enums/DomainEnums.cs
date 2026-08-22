namespace MadinahPlus.Domain.Enums;

public enum CertificationStatus
{
    NotCertified = 0,
    Conditional = 1,
    Certified = 2
}

public enum InspectionItemStatus
{
    Fail = 0,
    Needs = 1,
    Pass = 2,
    NotApplicable = 3
}

public enum UserRole
{
    Student = 0,
    Municipality = 1
}

public enum PrioritySeverity
{
    Low = 0,
    Medium = 1,
    High = 2
}

public enum TrendDirection
{
    Down = 0,
    Flat = 1,
    Up = 2
}
