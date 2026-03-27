using CinePass_be.DTOs.Movie;
using CinePass_be.Models;
using CinePass_be.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace CinePass_be.Controllers;

[ApiController]
[Route("api/movies")]
public class MoviesController(IMovieRepository movieRepo) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMovies(
        [FromQuery] string? status,
        [FromQuery] int? genreId,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await movieRepo.GetMoviesPagedAsync(status, genreId, search, page, pageSize);
        return Ok(result);
    }

    [HttpGet("trending")]
    public async Task<IActionResult> GetTrending()
    {
        var result = await movieRepo.GetMoviesPagedAsync("NOW_SHOWING", null, null, 1, 10);
        var items = result.Items
            .OrderByDescending(m => m.RatingAvg)
            .Take(10);

        return Ok(items);
    }

    [HttpGet("coming-soon")]
    public async Task<IActionResult> GetComingSoon()
    {
        var result = await movieRepo.GetMoviesPagedAsync("COMING_SOON", null, null, 1, 10);
        var items = result.Items
            .OrderBy(m => m.ReleaseDate)
            .Take(10);

        return Ok(items);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var movie = await movieRepo.GetMovieDetailAsync(id);

        if (movie is null)
            return NotFound(new { message = "Khong tim thay phim." });

        return Ok(movie);
    }
}
