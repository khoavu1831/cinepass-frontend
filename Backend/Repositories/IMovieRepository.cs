using CinePass_be.DTOs.Movie;
using CinePass_be.Models;

namespace CinePass_be.Repositories;

/// <summary>
/// Movie Repository interface with specific queries
/// </summary>
public interface IMovieRepository : IRepository<Movie>
{
    Task<PagedResult<MovieListItemDto>> GetMoviesPagedAsync(
        string? status, 
        int? genreId, 
        string? search, 
        int page = 1, 
        int pageSize = 20);
    
    Task<MovieDetailDto?> GetMovieDetailAsync(Guid id);
    
    Task<Movie?> GetMovieWithGenresAsync(Guid id);
    
    Task<IEnumerable<Movie>> GetMoviesByGenreAsync(int genreId);
}
