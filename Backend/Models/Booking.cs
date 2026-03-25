namespace CinePass_be.Models;

public enum BookingStatus { PENDING, PAID, CANCELLED, EXPIRED }

public class Booking
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid ShowtimeId { get; set; }
    public decimal TotalPrice { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.PENDING;
    public string? PaymentMethod { get; set; }
    public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddMinutes(10);
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Showtime Showtime { get; set; } = null!;
    public ICollection<BookingSeat> BookingSeats { get; set; } = [];
}
