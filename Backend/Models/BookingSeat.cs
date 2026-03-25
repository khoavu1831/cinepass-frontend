namespace CinePass_be.Models;

public class BookingSeat
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid BookingId { get; set; }
    public Guid SeatId { get; set; }
    public Guid ShowtimeId { get; set; }
    public decimal PriceAtBooking { get; set; }

    public Booking Booking { get; set; } = null!;
    public Seat Seat { get; set; } = null!;
}
