using CinePass_be.Data;
using CinePass_be.DTOs.Movie;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CinePass_be.Controllers;

[ApiController]
[Route("api/genres")]
public class GenresController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var genres = await db.Genres
            .OrderBy(g => g.Name)
            .Select(g => new GenreDto
            {
                Id = g.Id,
                Name = g.Name,
                Slug = g.Slug
            })
            .ToListAsync();

        return Ok(genres);
    }
}
