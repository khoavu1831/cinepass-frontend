using CinePass_be.Data;
using CinePass_be.DTOs.Auth;
using CinePass_be.Models;
using Microsoft.EntityFrameworkCore;

namespace CinePass_be.Services;

public class AuthService(AppDbContext db, JwtService jwt)
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest req)
    {
        if (await db.Users.AnyAsync(u => u.Email == req.Email))
            throw new InvalidOperationException("Email da duoc su dung.");

        if (await db.Users.AnyAsync(u => u.Username == req.Username))
            throw new InvalidOperationException("Username da duoc su dung.");

        var user = new User
        {
            Username = req.Username.Trim(),
            Email = req.Email.Trim().ToLower(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password)
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return BuildResponse(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest req)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email.ToLower())
            ?? throw new InvalidOperationException("Email hoac mat khau khong dung.");

        if (!BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            throw new InvalidOperationException("Email hoac mat khau khong dung.");

        if (!user.IsActive)
            throw new InvalidOperationException("Tai khoan da bi khoa.");

        return BuildResponse(user);
    }

    public async Task<UserDto> GetMeAsync(Guid userId)
    {
        var user = await db.Users.FindAsync(userId)
            ?? throw new InvalidOperationException("Khong tim thay nguoi dung.");

        return ToDto(user);
    }

    private AuthResponse BuildResponse(User user) => new()
    {
        Token = jwt.GenerateToken(user),
        User = ToDto(user)
    };

    private static UserDto ToDto(User user) => new()
    {
        Id = user.Id,
        Username = user.Username,
        Email = user.Email,
        AvatarUrl = user.AvatarUrl,
        Bio = user.Bio,
        Role = user.Role.ToString(),
        CreatedAt = user.CreatedAt
    };
}
