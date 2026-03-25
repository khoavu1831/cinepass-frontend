using CinePass_be.Services;
using Microsoft.AspNetCore.Mvc;

namespace CinePass_be.Controllers;

[ApiController]
[Route("api/seed")]
public class SeedController(TmdbService tmdb, IWebHostEnvironment env) : ControllerBase
{
    [HttpPost("movies")]
    public async Task<IActionResult> SeedMovies([FromQuery] int count = 20)
    {
        if (!env.IsDevelopment())
            return Forbid();

        var seeded = await tmdb.SeedMoviesAsync(count);
        return Ok(new { message = $"Da seed {seeded} phim thanh cong." });
    }
}
