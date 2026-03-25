using CinePass_be.Data;
using CinePass_be.DTOs.Movie;
using CinePass_be.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CinePass_be.Controllers;

[ApiController]
[Route("api/movies")]
public class MoviesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMovies(
        [FromQuery] string? status,
        [FromQuery] int? genreId,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = db.Movies
            .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) &&
            Enum.TryParse<MovieStatus>(status, true, out var statusEnum))
            query = query.Where(m => m.Status == statusEnum);

        if (genreId.HasValue)
            query = query.Where(m => m.MovieGenres.Any(mg => mg.GenreId == genreId));

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(m => m.Title.Contains(search) || (m.OriginalTitle != null && m.OriginalTitle.Contains(search)));

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(m => ToListItem(m))
            .ToListAsync();

        return Ok(new PagedResult<MovieListItemDto>
        {
            Items = items,
            TotalCount = total,
            Page = page,
            PageSize = pageSize
        });
    }

    [HttpGet("trending")]
    public async Task<IActionResult> GetTrending()
    {
        var items = await db.Movies
            .Include(m => m.MovieGenres).ThenInclude(mg => mg.Genre)
            .Where(m => m.Status == MovieStatus.NOW_SHOWING)
            .OrderByDescending(m => m.RatingAvg)
            .Take(10)
            .Select(m => ToListItem(m))
            .ToListAsync();

        return Ok(items);
    }

    [HttpGet("coming-soon")]
    public async Task<IActionResult> GetComingSoon()
    {
        var items = await db.Movies
            .Include(m => m.MovieGenres).ThenInclude(mg => mg.Genre)
            .Where(m => m.Status == MovieStatus.COMING_SOON)
            .OrderBy(m => m.ReleaseDate)
            .Take(10)
            .Select(m => ToListItem(m))
            .ToListAsync();

        return Ok(items);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var movie = await db.Movies
            .Include(m => m.MovieGenres).ThenInclude(mg => mg.Genre)
            .FirstOrDefaultAsync(m => m.Id == id);

        if (movie is null)
            return NotFound(new { message = "Khong tim thay phim." });

        return Ok(new MovieDetailDto
        {
            Id = movie.Id,
            Title = movie.Title,
            OriginalTitle = movie.OriginalTitle,
            Description = movie.Description,
            PosterUrl = movie.PosterUrl,
            TrailerUrl = movie.TrailerUrl,
            ReleaseDate = movie.ReleaseDate,
            RatingAvg = movie.RatingAvg,
            Status = movie.Status.ToString(),
            Duration = movie.Duration,
            Language = movie.Language,
            Genres = movie.MovieGenres.Select(mg => new GenreDto
            {
                Id = mg.Genre.Id,
                Name = mg.Genre.Name,
                Slug = mg.Genre.Slug
            }).ToList()
        });
    }

    private static MovieListItemDto ToListItem(Movie m) => new()
    {
        Id = m.Id,
        Title = m.Title,
        OriginalTitle = m.OriginalTitle,
        PosterUrl = m.PosterUrl,
        ReleaseDate = m.ReleaseDate,
        RatingAvg = m.RatingAvg,
        Status = m.Status.ToString(),
        Duration = m.Duration,
        Genres = m.MovieGenres.Select(mg => new GenreDto
        {
            Id = mg.Genre.Id,
            Name = mg.Genre.Name,
            Slug = mg.Genre.Slug
        }).ToList()
    };
}
