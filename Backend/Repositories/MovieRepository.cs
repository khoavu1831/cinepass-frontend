using CinePass_be.Data;
using CinePass_be.DTOs.Movie;
using CinePass_be.Models;
using Microsoft.EntityFrameworkCore;

namespace CinePass_be.Repositories;

/// <summary>
/// Movie Repository implementation with specific queries
/// </summary>
public class MovieRepository : Repository<Movie>, IMovieRepository
{
    public MovieRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<PagedResult<MovieListItemDto>> GetMoviesPagedAsync(
        string? status, 
        int? genreId, 
        string? search, 
        int page = 1, 
        int pageSize = 20)
    {
        var query = _dbSet
            .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<MovieStatus>(status, true, out var statusEnum))
            query = query.Where(m => m.Status == statusEnum);

        if (genreId.HasValue)
            query = query.Where(m => m.MovieGenres.Any(mg => mg.GenreId == genreId));

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(m => m.Title.Contains(search) || 
                                      (m.OriginalTitle != null && m.OriginalTitle.Contains(search)));

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(m => ToListItem(m))
            .ToListAsync();

        return new PagedResult<MovieListItemDto>
        {
            Items = items,
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<MovieDetailDto?> GetMovieDetailAsync(Guid id)
    {
        return await _dbSet
            .Where(m => m.Id == id)
            .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
            .Select(m => ToDetailDto(m))
            .FirstOrDefaultAsync();
    }

    public async Task<Movie?> GetMovieWithGenresAsync(Guid id)
    {
        return await _dbSet
            .Where(m => m.Id == id)
            .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Movie>> GetMoviesByGenreAsync(int genreId)
    {
        return await _dbSet
            .Where(m => m.MovieGenres.Any(mg => mg.GenreId == genreId))
            .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
            .ToListAsync();
    }

    private static MovieListItemDto ToListItem(Movie m)
    {
        return new MovieListItemDto
        {
            Id = m.Id,
            Title = m.Title,
            OriginalTitle = m.OriginalTitle,
            Poster = m.Poster,
            ReleaseDate = m.ReleaseDate,
            Status = m.Status.ToString(),
            RatingAvg = m.RatingAvg,
            Genres = m.MovieGenres?.Select(mg => new GenreDto 
            { 
                Id = mg.Genre.Id, 
                Name = mg.Genre.Name 
            }).ToList() ?? []
        };
    }

    private static MovieDetailDto ToDetailDto(Movie m)
    {
        return new MovieDetailDto
        {
            Id = m.Id,
            Title = m.Title,
            OriginalTitle = m.OriginalTitle,
            Poster = m.Poster,
            Backdrop = m.Backdrop,
            ReleaseDate = m.ReleaseDate,
            EndDate = m.EndDate,
            Status = m.Status.ToString(),
            RatingAvg = m.RatingAvg,
            Director = m.Director,
            Description = m.Description,
            Duration = m.Duration,
            TmdbId = m.TmdbId,
            Genres = m.MovieGenres?.Select(mg => new GenreDto 
            { 
                Id = mg.Genre.Id, 
                Name = mg.Genre.Name 
            }).ToList() ?? []
        };
    }
}
