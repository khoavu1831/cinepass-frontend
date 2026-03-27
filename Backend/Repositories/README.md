# 📚 Hướng dẫn Repository Pattern trong CinePass

## Lợi ích của Repository Pattern

- ✅ **Tách biệt Concern**: Database logic tách riêng khỏi Controller/Service
- ✅ **Dễ test**: Có thể mock Repository để unit test
- ✅ **Tái sử dụng**: Các repository được dùng chung giữa nhiều Service/Controller
- ✅ **Bảo trì dễ hơn**: Thay đổi database logic chỉ cần sửa Repository
- ✅ **DDD friendly**: Phù hợp Domain-Driven Design

---

## 📁 Cấu trúc đã tạo

```
Backend/
├── Repositories/
│   ├── IRepository.cs              # Generic interface
│   ├── Repository.cs               # Generic implementation
│   ├── IUserRepository.cs          # User-specific interface
│   ├── UserRepository.cs           # User-specific implementation
│   ├── IMovieRepository.cs         # Movie-specific interface
│   ├── MovieRepository.cs          # Movie-specific implementation
│   └── [các Repository khác]
├── Services/
│   └── AuthService.cs              # ✅ Đã cập nhật dùng IUserRepository
├── Controllers/
│   └── MoviesController.cs         # ✅ Đã cập nhật dùng IMovieRepository
└── Program.cs                      # ✅ Đã cấu hình DI
```

---

## 🚀 Cách tạo Repository mới

### Bước 1: Tạo Interface Repository

```csharp
// Repositories/IGenreRepository.cs
using CinePass_be.Models;

namespace CinePass_be.Repositories;

public interface IGenreRepository : IRepository<Genre>
{
    // Các query custom cho Genre
    Task<Genre?> GetBySlugAsync(string slug);
    Task<IEnumerable<Genre>> GetPopularAsync(int limit = 10);
}
```

### Bước 2: Implement Repository

```csharp
// Repositories/GenreRepository.cs
using CinePass_be.Data;
using CinePass_be.Models;
using Microsoft.EntityFrameworkCore;

namespace CinePass_be.Repositories;

public class GenreRepository : Repository<Genre>, IGenreRepository
{
    public GenreRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Genre?> GetBySlugAsync(string slug)
    {
        return await _dbSet.FirstOrDefaultAsync(g => g.Slug == slug);
    }

    public async Task<IEnumerable<Genre>> GetPopularAsync(int limit = 10)
    {
        return await _dbSet
            .OrderByDescending(g => g.MovieGenres.Count)
            .Take(limit)
            .ToListAsync();
    }
}
```

### Bước 3: Đăng ký DI trong Program.cs

```csharp
// Program.cs
builder.Services.AddScoped<IGenreRepository, GenreRepository>();
```

### Bước 4: Sử dụng trong Service/Controller

```csharp
// Services/MovieService.cs
public class MovieService(IMovieRepository movieRepo, IGenreRepository genreRepo)
{
    public async Task<List<MovieDto>> GetMoviesByGenreAsync(string genreSlug)
    {
        var genre = await genreRepo.GetBySlugAsync(genreSlug);
        if (genre is null)
            throw new InvalidOperationException("Genre not found");

        var movies = await movieRepo.GetMoviesByGenreAsync(genre.Id);
        return movies.Select(ToDto).ToList();
    }
}
```

---

## 📋 Danh sách Repository cần tạo

| Entity | Repository | Ghi chú |
|--------|-----------|--------|
| Genre | `IGenreRepository` | ✅ Hướng dẫn ở trên |
| Cinema | `ICinemaRepository` | Quản lý rạp chiếu |
| Room | `IRoomRepository` | Quản lý phòng chiếu |
| Showtime | `IShowtimeRepository` | Quản lý suất chiếu |
| Booking | `IBookingRepository` | Quản lý đặt vé |
| Review | `IReviewRepository` | Quản lý bình luận phim |
| Like | `ILikeRepository` | Quản lý yêu thích |
| Notification | `INotificationRepository` | Quản lý thông báo |
| Follow | `IFollowRepository` | Quản lý theo dõi user |

---

## 💡 Best Practices

### ✅ Các query phức tạp nên để ở Repository

```csharp
// ✅ GOOD - Logic phức tạp ở Repository
public class BookingRepository : Repository<Booking>, IBookingRepository
{
    public async Task<IEnumerable<BookingDto>> GetUserBookingsAsync(Guid userId)
    {
        return await _dbSet
            .Where(b => b.UserId == userId)
            .Include(b => b.Showtime)
                .ThenInclude(s => s.Movie)
            .Include(b => b.BookingSeats)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => ToDto(b))
            .ToListAsync();
    }
}
```

### ❌ Những gì KHÔNG nên làm

```csharp
// ❌ BAD - Đừng để DbContext trực tiếp vào Controller
public class MoviesController(AppDbContext db)
{
    public async Task<IActionResult> GetMovies()
    {
        var movies = await db.Movies.ToListAsync(); // ❌ Tránh!
        return Ok(movies);
    }
}

// ❌ BAD - Đừng mix database logic vào Service
public class MovieService
{
    public async Task<Movie> CreateMovieAsync(MovieDto dto)
    {
        var movie = new Movie { ... };
        db.Movies.Add(movie);              // ❌ Tránh!
        await db.SaveChangesAsync();
        return movie;
    }
}
```

### ✅ Pattern đúng

```csharp
// ✅ GOOD - Sử dụng Repository trong Service
public class MovieService(IMovieRepository movieRepo, IGenreRepository genreRepo)
{
    public async Task<MovieDto> CreateMovieAsync(CreateMovieDto dto)
    {
        var movie = new Movie { /* map từ dto */ };
        await movieRepo.AddAsync(movie);
        await movieRepo.SaveChangesAsync();
        return ToDto(movie);
    }
}

// ✅ GOOD - Controller chỉ gọi Service
public class MoviesController(MovieService movieService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CreateMovie(CreateMovieDto dto)
    {
        var result = await movieService.CreateMovieAsync(dto);
        return Created($"/api/movies/{result.Id}", result);
    }
}
```

---

## 🔄 Các method chung từ IRepository<T>

Từ Generic Repository, bạn có thể dùng:

```csharp
// Lấy dữ liệu
await repo.GetByIdAsync(id);
await repo.GetAllAsync();
await repo.FindAsync(m => m.Status == status);
await repo.FirstOrDefaultAsync(m => m.Id == id);
await repo.AnyAsync(m => m.Email == email);
await repo.CountAsync(m => m.Status == "active");

// Thêm/Sửa/Xóa
await repo.AddAsync(entity);
await repo.AddRangeAsync(entities);
await repo.UpdateAsync(entity);
await repo.DeleteAsync(entity);
await repo.DeleteRangeAsync(entities);

// Lưu
await repo.SaveChangesAsync();
```

---

## 🎯 Ví dụ: BookingRepository

```csharp
// Repositories/IBookingRepository.cs
using CinePass_be.Models;

namespace CinePass_be.Repositories;

public interface IBookingRepository : IRepository<Booking>
{
    Task<Booking?> GetWithDetailsAsync(Guid id);
    Task<IEnumerable<Booking>> GetUserBookingsAsync(Guid userId);
    Task<IEnumerable<Booking>> GetShowtimeBookingsAsync(Guid showtimeId);
    Task<int> GetAvailableSeatsAsync(Guid showtimeId);
}
```

```csharp
// Repositories/BookingRepository.cs
using CinePass_be.Data;
using CinePass_be.Models;
using Microsoft.EntityFrameworkCore;

namespace CinePass_be.Repositories;

public class BookingRepository : Repository<Booking>, IBookingRepository
{
    public BookingRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<Booking?> GetWithDetailsAsync(Guid id)
    {
        return await _dbSet
            .Where(b => b.Id == id)
            .Include(b => b.Showtime)
                .ThenInclude(s => s.Movie)
            .Include(b => b.Showtime)
                .ThenInclude(s => s.Room)
            .Include(b => b.BookingSeats)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<Booking>> GetUserBookingsAsync(Guid userId)
    {
        return await _dbSet
            .Where(b => b.UserId == userId)
            .Include(b => b.Showtime)
                .ThenInclude(s => s.Movie)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetShowtimeBookingsAsync(Guid showtimeId)
    {
        return await _dbSet
            .Where(b => b.ShowtimeId == showtimeId)
            .Include(b => b.BookingSeats)
            .ToListAsync();
    }

    public async Task<int> GetAvailableSeatsAsync(Guid showtimeId)
    {
        var room = await _context.Showtimes
            .Where(s => s.Id == showtimeId)
            .Select(s => s.Room)
            .FirstOrDefaultAsync();

        if (room is null)
            return 0;

        var bookedSeats = await _context.BookingSeats
            .Where(bs => bs.Booking.ShowtimeId == showtimeId)
            .CountAsync();

        return (room.Rows * room.SeatsPerRow) - bookedSeats;
    }
}
```

---

## ⚙️ Cấu hình đã hoàn tất

✅ Generic Repository đã tạo  
✅ UserRepository & MovieRepository đã tạo  
✅ DI Container đã cấu hình  
✅ AuthService đã cập nhật  
✅ MoviesController đã cập nhật  

**Tiếp theo**: Tạo Repository cho các entity khác theo hướng dẫn trên!
