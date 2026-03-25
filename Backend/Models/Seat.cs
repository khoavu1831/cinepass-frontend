namespace CinePass_be.Models;

public enum SeatType { STANDARD, VIP, COUPLE }

public class Seat
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RoomId { get; set; }
    public char Row { get; set; }
    public int Number { get; set; }
    public SeatType Type { get; set; } = SeatType.STANDARD;

    public Room Room { get; set; } = null!;
    public ICollection<BookingSeat> BookingSeats { get; set; } = [];
}
