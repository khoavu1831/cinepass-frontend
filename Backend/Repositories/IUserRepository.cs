using CinePass_be.Models;

namespace CinePass_be.Repositories;

/// <summary>
/// User Repository interface with specific queries
/// </summary>
public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    
    Task<User?> GetByUsernameAsync(string username);
    
    Task<bool> EmailExistsAsync(string email);
    
    Task<bool> UsernameExistsAsync(string username);
}
