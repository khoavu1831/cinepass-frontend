namespace CinePass_be.Models;

public enum NotificationType { LIKE, COMMENT, FOLLOW, BOOKING_CONFIRMED }

public class Notification
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public NotificationType Type { get; set; }
    public Guid? ActorId { get; set; }
    public Guid? EntityId { get; set; }
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}
