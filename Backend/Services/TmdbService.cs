using System.Text.Json;
using CinePass_be.Data;
using CinePass_be.Models;
using Microsoft.EntityFrameworkCore;

namespace CinePass_be.Services;

public class TmdbService(HttpClient http, IConfiguration config, AppDbContext db)
{
    private readonly string _token = config["Tmdb:Token"]!;
    private readonly string _baseUrl = config["Tmdb:BaseUrl"] ?? "https://api.themoviedb.org/3/";
    private readonly string _imageBase = "https://image.tmdb.org/t/p/w500";

    private HttpRequestMessage BuildRequest(string path)
    {
        var req = new HttpRequestMessage(HttpMethod.Get, _baseUrl + path);
        req.Headers.Add("Authorization", $"Bearer {_token}");
        req.Headers.Add("Accept", "application/json");
        return req;
    }

    public async Task<int> SeedMoviesAsync(int count = 20)
    {
        await SeedGenresAsync();

        var seeded = 0;
        var page = 1;

        while (seeded < count)
        {
            var res = await http.SendAsync(BuildRequest($"movie/popular?language=vi-VN&page={page}"));
            if (!res.IsSuccessStatusCode) break;

            var json = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
            var results = json.RootElement.GetProperty("results");

            foreach (var item in results.EnumerateArray())
            {
                if (seeded >= count) break;

                var tmdbId = item.GetProperty("id").GetInt32();

                if (await db.Movies.AnyAsync(m => m.TmdbId == tmdbId))
                    continue;

                var releaseStr = item.TryGetProperty("release_date", out var rd) ? rd.GetString() : null;
                DateOnly? releaseDate = DateOnly.TryParse(releaseStr, out var d) ? d : null;

                var movie = new Movie
                {
                    TmdbId = tmdbId,
                    Title = item.GetProperty("title").GetString() ?? "",
                    OriginalTitle = item.TryGetProperty("original_title", out var ot) ? ot.GetString() : null,
                    Description = item.TryGetProperty("overview", out var ov) ? ov.GetString() : null,
                    Duration = 120,
                    ReleaseDate = releaseDate,
                    PosterUrl = item.TryGetProperty("poster_path", out var pp) && pp.GetString() != null
                        ? _imageBase + pp.GetString()
                        : null,
                    Language = item.TryGetProperty("original_language", out var lang) ? lang.GetString() : null,
                    Status = releaseDate.HasValue && releaseDate.Value > DateOnly.FromDateTime(DateTime.Today)
                        ? MovieStatus.COMING_SOON
                        : MovieStatus.NOW_SHOWING,
                    RatingAvg = item.TryGetProperty("vote_average", out var va)
                        ? Math.Round((decimal)va.GetDouble(), 1)
                        : 0
                };

                db.Movies.Add(movie);
                await db.SaveChangesAsync();

                if (item.TryGetProperty("genre_ids", out var genreIds))
                {
                    foreach (var gid in genreIds.EnumerateArray())
                    {
                        var genreId = gid.GetInt32();
                        if (await db.Genres.AnyAsync(g => g.Id == genreId))
                        {
                            db.MovieGenres.Add(new MovieGenre
                            {
                                MovieId = movie.Id,
                                GenreId = genreId
                            });
                        }
                    }
                    await db.SaveChangesAsync();
                }

                seeded++;
            }

            page++;
            if (!json.RootElement.TryGetProperty("total_pages", out var tp) || page > tp.GetInt32())
                break;
        }

        return seeded;
    }

    private async Task SeedGenresAsync()
    {
        var res = await http.SendAsync(BuildRequest("genre/movie/list?language=vi"));
        if (!res.IsSuccessStatusCode) return;

        var json = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
        var genres = json.RootElement.GetProperty("genres");

        foreach (var item in genres.EnumerateArray())
        {
            var id = item.GetProperty("id").GetInt32();
            var name = item.GetProperty("name").GetString() ?? "";

            if (!await db.Genres.AnyAsync(g => g.Id == id))
            {
                db.Genres.Add(new Genre
                {
                    Id = id,
                    Name = name,
                    Slug = name.ToLower().Replace(" ", "-").Replace("&", "and")
                });
            }
        }

        await db.SaveChangesAsync();
    }
}
