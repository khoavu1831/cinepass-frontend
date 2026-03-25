namespace CinePass_be.Models;

public class Like
{
    public Guid UserId { get; set; }
    public Guid ReviewId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Review Review { get; set; } = null!;
}
