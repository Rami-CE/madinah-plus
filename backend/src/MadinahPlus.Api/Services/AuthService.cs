using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MadinahPlus.Domain.Contracts;
using MadinahPlus.Domain.Entities;
using MadinahPlus.Domain.Enums;
using MadinahPlus.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace MadinahPlus.Api.Services;

public class AuthService
{
    private readonly IUserRepository _users;
    private readonly IConfiguration _config;
    private readonly PasswordHasher<AppUser> _hasher = new();

    public AuthService(IUserRepository users, IConfiguration config)
    {
        _users = users;
        _config = config;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            throw new UnauthorizedAccessException("Email and password are required.");

        var user = await _users.GetByEmailAsync(request.Email.Trim(), ct)
            ?? throw new UnauthorizedAccessException("Invalid credentials.");

        var verify = _hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (verify == PasswordVerificationResult.Failed)
            throw new UnauthorizedAccessException("Invalid credentials.");

        if (!string.IsNullOrWhiteSpace(request.Role) &&
            !string.Equals(user.Role.ToString(), request.Role, StringComparison.OrdinalIgnoreCase))
            throw new UnauthorizedAccessException("This account does not match the selected role.");

        return new LoginResponse
        {
            Token = CreateToken(user),
            User = ToDto(user)
        };
    }

    public async Task<AuthUserDto> GetCurrentAsync(int id, CancellationToken ct = default)
    {
        var user = await _users.GetByIdAsync(id, ct)
            ?? throw new UnauthorizedAccessException("User was not found.");
        return ToDto(user);
    }

    public static AuthUserDto ToDto(AppUser user) => new()
    {
        Id = user.Id,
        Name = user.Name,
        Email = user.Email,
        Role = user.Role.ToString()
    };

    private string CreateToken(AppUser user)
    {
        var key = _config["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is missing.");
        var issuer = _config["Jwt:Issuer"] ?? "MadinahPlus";
        var audience = _config["Jwt:Audience"] ?? "MadinahPlus";
        var hours = int.TryParse(_config["Jwt:ExpiresHours"], out var h) ? h : 72;

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role == UserRole.Municipality ? "Municipality" : "Student")
        };

        var creds = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer,
            audience,
            claims,
            expires: DateTime.UtcNow.AddHours(hours),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
