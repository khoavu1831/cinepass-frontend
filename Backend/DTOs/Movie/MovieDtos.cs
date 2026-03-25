namespace CinePass_be.DTOs.Movie;

public class GenreDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Slug { get; set; }
}

public class MovieListItemDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? OriginalTitle { get; set; }
    public string? PosterUrl { get; set; }
    public DateOnly? ReleaseDate { get; set; }
    public decimal RatingAvg { get; set; }
    public string Status { get; set; } = string.Empty;
    public int Duration { get; set; }
    public List<GenreDto> Genres { get; set; } = [];
}

public class MovieDetailDto : MovieListItemDto
{
    public string? Description { get; set; }
    public string? TrailerUrl { get; set; }
    public string? Language { get; set; }
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = [];
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}
