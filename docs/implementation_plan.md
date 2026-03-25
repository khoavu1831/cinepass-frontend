# Phase 1 — Implementation Plan

## Tong quan

Xay dung Backend ASP.NET Core 8 (.NET 10) day du (MySQL, EF Core, JWT) va ket noi Frontend React vao Backend API thay vi goi TMDB truc tiep. Du lieu phim duoc lay qua TMDB API roi luu vao MySQL de Frontend luon doc tu Backend.

---

## Backend

### NuGet Packages

#### [MODIFY] CinePass-be.csproj
Them cac packages:
- `Pomelo.EntityFrameworkCore.MySql` — EF Core provider cho MySQL
- `Microsoft.EntityFrameworkCore.Design` — migration tools
- `Microsoft.AspNetCore.Authentication.JwtBearer` — JWT auth
- `BCrypt.Net-Next` — hash password

---

### Config

#### [MODIFY] appsettings.json
Them cac section:
- `ConnectionStrings.DefaultConnection` — MySQL connection string
- `Jwt.Key`, `Jwt.Issuer`, `Jwt.Audience`, `Jwt.ExpiryMinutes`
- `Tmdb.Token`, `Tmdb.BaseUrl`

---

### Models (EF Core Entities)

#### [NEW] Models/User.cs
Fields: Id (Guid), Username, Email, PasswordHash, AvatarUrl, Bio, Role enum, IsActive, CreatedAt, UpdatedAt

#### [NEW] Models/Follow.cs
Fields: FollowerId, FollowingId, CreatedAt — composite PK

#### [NEW] Models/Movie.cs
Fields: Id (Guid), TmdbId (int unique), Title, OriginalTitle, Description, Duration, ReleaseDate, PosterUrl, TrailerUrl, Language, Status enum, RatingAvg, CreatedAt

#### [NEW] Models/Genre.cs
Fields: Id (int), Name, Slug

#### [NEW] Models/MovieGenre.cs
Join table: MovieId, GenreId — composite PK

#### [NEW] Models/Cinema.cs
Fields: Id (Guid), Name, Location, City, Phone, ImageUrl

#### [NEW] Models/Room.cs
Fields: Id (Guid), CinemaId, Name, Type enum, TotalSeats

#### [NEW] Models/Seat.cs
Fields: Id (Guid), RoomId, Row (char), Number (int), Type enum — unique(RoomId, Row, Number)

#### [NEW] Models/Showtime.cs
Fields: Id (Guid), MovieId, RoomId, StartTime, EndTime, BasePrice, Status enum

#### [NEW] Models/Booking.cs
Fields: Id (Guid), UserId, ShowtimeId, TotalPrice, Status enum, PaymentMethod, ExpiresAt, CreatedAt

#### [NEW] Models/BookingSeat.cs
Fields: Id (Guid), BookingId, SeatId, PriceAtBooking — unique(ShowtimeId, SeatId)

#### [NEW] Models/Review.cs
Fields: Id (Guid), UserId, MovieId, Content, Rating (decimal 0-10), Spoiler, LikeCount, CommentCount, CreatedAt, UpdatedAt — unique(UserId, MovieId)

#### [NEW] Models/Comment.cs
Fields: Id (Guid), UserId, ReviewId, ParentId (nullable), Content, CreatedAt, UpdatedAt

#### [NEW] Models/Like.cs
Fields: UserId, ReviewId, CreatedAt — composite PK

#### [NEW] Models/Notification.cs
Fields: Id (Guid), UserId, Type enum, ActorId, EntityId, IsRead, CreatedAt

---

### Data

#### [NEW] Data/AppDbContext.cs
DbSets cho tat ca entities. Fluent API config:
- composite PKs (Follow, MovieGenre, Like)
- unique indexes (User.Email, User.Username, Movie.TmdbId, Seat(RoomId,Row,Number), Review(UserId,MovieId))
- enum chuyen thanh string
- cascade delete rules

---

### DTOs

#### [NEW] DTOs/Auth/ — RegisterRequest, LoginRequest, AuthResponse, UserDto
#### [NEW] DTOs/Movie/ — MovieDto, MovieListItemDto, GenreDto

---

### Services

#### [NEW] Services/JwtService.cs
- `GenerateToken(User user)` — tra ve JWT string
- `ValidateToken(string token)` — tra ve ClaimsPrincipal

#### [NEW] Services/AuthService.cs
- `RegisterAsync(RegisterRequest)` — hash password, luu DB, tra ve AuthResponse
- `LoginAsync(LoginRequest)` — verify password, tra ve AuthResponse
- `GetMeAsync(Guid userId)` — tra ve UserDto

#### [NEW] Services/TmdbService.cs
- `FetchPopularMoviesAsync(int page)` — goi TMDB /movie/popular
- `FetchMoviesByGenreAsync(int genreId)` — goi TMDB /discover/movie
- `FetchGenresAsync()` — goi TMDB /genre/movie/list
- `SeedMoviesAsync(int count)` — fetch tu TMDB, map, luu vao DB (upsert theo TmdbId)

---

### Controllers

#### [NEW] Controllers/AuthController.cs
- `POST /api/auth/register` — dang ki
- `POST /api/auth/login` — dang nhap, tra JWT
- `GET /api/auth/me` — [Authorize] thong tin user hien tai

#### [NEW] Controllers/MoviesController.cs
- `GET /api/movies` — list (query: status, genreId, search, page, pageSize)
- `GET /api/movies/{id}` — chi tiet
- `GET /api/movies/trending` — top 10 RatingAvg
- `GET /api/movies/coming-soon` — status = COMING_SOON

#### [NEW] Controllers/GenresController.cs
- `GET /api/genres` — toan bo the loai

#### [NEW] Controllers/SeedController.cs (chi dev mode)
- `POST /api/seed/movies?count=20` — goi TmdbService.SeedMoviesAsync

---

### Middleware & Program.cs

#### [MODIFY] Program.cs
- AddDbContext (Pomelo MySQL)
- AddAuthentication (JwtBearer)
- AddCors (allow http://localhost:5173)
- AddScoped: JwtService, AuthService, TmdbService
- AddHttpClient (cho TmdbService)
- UseAuthentication, UseAuthorization, UseCors

---

## Frontend

### [NEW] src/stores/authStore.js
Zustand store: `{ user, token, login, logout, setUser }` — persist token vao localStorage

### [MODIFY] src/api/axios.js (replace api/http.js)
Axios instance: baseURL = VITE_API_URL, interceptor gan Bearer token tu authStore vao header

### [NEW] src/api/authApi.js
- `register(data)`, `login(data)`, `getMe()`

### [NEW] src/api/movieApi.js
- `getMovies(params)`, `getMovieById(id)`, `getTrending()`, `getComingSoon()`

### [NEW] src/pages/Auth/Login.jsx & Register.jsx
Form don gian, goi authApi, luu vao authStore, redirect ve Home

### [MODIFY] src/pages/Home/Home.jsx
Thay cac goi TMDB truc tiep bang movieApi.getTrending() va movieApi.getMovies()

---

## Verification Plan

### Automated (manual run)
```bash
# Build backend
cd d:\WorkSpace\CinePass\Backend
dotnet build

# Chay migration
dotnet ef migrations add InitialCreate
dotnet ef database update

# Chay backend
dotnet run

# Seed du lieu phim (dung curl hoac browser)
curl -X POST http://localhost:5000/api/seed/movies?count=20

# Test auth
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"username\":\"test\",\"email\":\"test@test.com\",\"password\":\"Test1234!\"}"
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"Test1234!\"}"

# Test movies API
curl http://localhost:5000/api/movies
curl http://localhost:5000/api/movies/trending
```

### Frontend Verification
```bash
cd d:\WorkSpace\CinePass\Frontend
npm run dev
```
Mo trinh duyet http://localhost:5173 kiem tra trang Home hien thi phim tu Backend API.
