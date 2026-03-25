namespace CinePass_be.Models;

public class Genre
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }

    public ICollection<MovieGenre> MovieGenres { get; set; } = [];
}
