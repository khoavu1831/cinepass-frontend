namespace CinePass_be.Models;

public enum ShowtimeStatus { SCHEDULED, ONGOING, ENDED, CANCELLED }

public class Showtime
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid MovieId { get; set; }
    public Guid RoomId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public decimal BasePrice { get; set; }
    public ShowtimeStatus Status { get; set; } = ShowtimeStatus.SCHEDULED;

    public Movie Movie { get; set; } = null!;
    public Room Room { get; set; } = null!;
    public ICollection<Booking> Bookings { get; set; } = [];
}
