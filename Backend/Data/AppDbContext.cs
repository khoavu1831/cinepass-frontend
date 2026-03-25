using CinePass_be.Models;
using Microsoft.EntityFrameworkCore;

namespace CinePass_be.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Follow> Follows => Set<Follow>();
    public DbSet<Movie> Movies => Set<Movie>();
    public DbSet<Genre> Genres => Set<Genre>();
    public DbSet<MovieGenre> MovieGenres => Set<MovieGenre>();
    public DbSet<Cinema> Cinemas => Set<Cinema>();
    public DbSet<Room> Rooms => Set<Room>();
    public DbSet<Seat> Seats => Set<Seat>();
    public DbSet<Showtime> Showtimes => Set<Showtime>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<BookingSeat> BookingSeats => Set<BookingSeat>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<Like> Likes => Set<Like>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        // --- User ---
        b.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Email).IsUnique();
            e.HasIndex(u => u.Username).IsUnique();
            e.Property(u => u.Role).HasConversion<string>();
        });

        // --- Follow ---
        b.Entity<Follow>(e =>
        {
            e.HasKey(f => new { f.FollowerId, f.FollowingId });
            e.HasOne(f => f.Follower)
                .WithMany(u => u.Following)
                .HasForeignKey(f => f.FollowerId)
                .OnDelete(DeleteBehavior.Restrict);
            e.HasOne(f => f.FollowingUser)
                .WithMany(u => u.Followers)
                .HasForeignKey(f => f.FollowingId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // --- Movie ---
        b.Entity<Movie>(e =>
        {
            e.HasKey(m => m.Id);
            e.HasIndex(m => m.TmdbId).IsUnique();
            e.Property(m => m.Status).HasConversion<string>();
            e.Property(m => m.RatingAvg).HasPrecision(3, 1);
        });

        // --- Genre ---
        b.Entity<Genre>(e =>
        {
            e.HasKey(g => g.Id);
            e.HasIndex(g => g.Slug).IsUnique();
        });

        // --- MovieGenre ---
        b.Entity<MovieGenre>(e =>
        {
            e.HasKey(mg => new { mg.MovieId, mg.GenreId });
            e.HasOne(mg => mg.Movie)
                .WithMany(m => m.MovieGenres)
                .HasForeignKey(mg => mg.MovieId);
            e.HasOne(mg => mg.Genre)
                .WithMany(g => g.MovieGenres)
                .HasForeignKey(mg => mg.GenreId);
        });

        // --- Room ---
        b.Entity<Room>(e =>
        {
            e.HasKey(r => r.Id);
            e.Property(r => r.Type).HasConversion<string>();
        });

        // --- Seat ---
        b.Entity<Seat>(e =>
        {
            e.HasKey(s => s.Id);
            e.HasIndex(s => new { s.RoomId, s.Row, s.Number }).IsUnique();
            e.Property(s => s.Type).HasConversion<string>();
        });

        // --- Showtime ---
        b.Entity<Showtime>(e =>
        {
            e.HasKey(s => s.Id);
            e.Property(s => s.Status).HasConversion<string>();
            e.Property(s => s.BasePrice).HasPrecision(10, 2);
        });

        // --- Booking ---
        b.Entity<Booking>(e =>
        {
            e.HasKey(b2 => b2.Id);
            e.Property(b2 => b2.Status).HasConversion<string>();
            e.Property(b2 => b2.TotalPrice).HasPrecision(10, 2);
        });

        // --- BookingSeat ---
        b.Entity<BookingSeat>(e =>
        {
            e.HasKey(bs => bs.Id);
            e.HasIndex(bs => new { bs.ShowtimeId, bs.SeatId }).IsUnique();
            e.Property(bs => bs.PriceAtBooking).HasPrecision(10, 2);
            e.HasOne(bs => bs.Booking)
                .WithMany(bk => bk.BookingSeats)
                .HasForeignKey(bs => bs.BookingId);
            e.HasOne(bs => bs.Seat)
                .WithMany(s => s.BookingSeats)
                .HasForeignKey(bs => bs.SeatId);
        });

        // --- Review ---
        b.Entity<Review>(e =>
        {
            e.HasKey(r => r.Id);
            e.HasIndex(r => new { r.UserId, r.MovieId }).IsUnique();
            e.Property(r => r.Rating).HasPrecision(3, 1);
        });

        // --- Comment ---
        b.Entity<Comment>(e =>
        {
            e.HasKey(c => c.Id);
            e.HasOne(c => c.Parent)
                .WithMany(c => c.Replies)
                .HasForeignKey(c => c.ParentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // --- Like ---
        b.Entity<Like>(e =>
        {
            e.HasKey(l => new { l.UserId, l.ReviewId });
            e.HasOne(l => l.User)
                .WithMany(u => u.Likes)
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // --- Notification ---
        b.Entity<Notification>(e =>
        {
            e.HasKey(n => n.Id);
            e.Property(n => n.Type).HasConversion<string>();
        });
    }
}
