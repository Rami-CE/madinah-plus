using MadinahPlus.Domain.Enums;

namespace MadinahPlus.Domain.Entities;

public class AppUser
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
    public UserRole Role { get; set; }
}
