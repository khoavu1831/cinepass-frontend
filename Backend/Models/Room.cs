namespace CinePass_be.Models;

public enum RoomType { STANDARD, VIP, IMAX, FOURDX }

public class Room
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CinemaId { get; set; }
    public string Name { get; set; } = string.Empty;
    public RoomType Type { get; set; } = RoomType.STANDARD;
    public int TotalSeats { get; set; }

    public Cinema Cinema { get; set; } = null!;
    public ICollection<Seat> Seats { get; set; } = [];
    public ICollection<Showtime> Showtimes { get; set; } = [];
}
