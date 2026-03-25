namespace CinePass_be.Models;

public class Cinema
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? Phone { get; set; }
    public string? ImageUrl { get; set; }

    public ICollection<Room> Rooms { get; set; } = [];
}
