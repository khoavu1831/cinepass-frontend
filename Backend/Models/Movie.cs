namespace CinePass_be.Models;

public enum MovieStatus { COMING_SOON, NOW_SHOWING, ENDED }

public class Movie
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public int? TmdbId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? OriginalTitle { get; set; }
    public string? Description { get; set; }
    public int Duration { get; set; }
    public DateOnly? ReleaseDate { get; set; }
    public string? PosterUrl { get; set; }
    public string? TrailerUrl { get; set; }
    public string? Language { get; set; }
    public MovieStatus Status { get; set; } = MovieStatus.NOW_SHOWING;
    public decimal RatingAvg { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<MovieGenre> MovieGenres { get; set; } = [];
    public ICollection<Showtime> Showtimes { get; set; } = [];
    public ICollection<Review> Reviews { get; set; } = [];
}
