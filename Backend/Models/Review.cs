namespace CinePass_be.Models;

public class Review
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid MovieId { get; set; }
    public string Content { get; set; } = string.Empty;
    public decimal Rating { get; set; }
    public bool Spoiler { get; set; } = false;
    public int LikeCount { get; set; } = 0;
    public int CommentCount { get; set; } = 0;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public User User { get; set; } = null!;
    public Movie Movie { get; set; } = null!;
    public ICollection<Like> Likes { get; set; } = [];
    public ICollection<Comment> Comments { get; set; } = [];
}
