# CinePass

1. Database design
- User & Auth
    - Users
        - Id
        - Username
        - Email
        - PasswordHash
        - AvatarUrl
        - Role (USER, ADMIN)
        - CreatedAt




- Phim và dữ liệu
    - Movies
        - Id
        - Title
        - Description
        - Duration
        - ReleaseDate
        - PosterUrl
        - TrailerUrl
        - RatingAvg

    - Genres
        - Id
        - Name

    - MovieGenres
        - MovieId
        - GenreId




- Rạp và suất chiếu
    - Cinemas
        - Id
        - Name
        - Location

    -  Rooms
        - Id
        - CinemaId
        - Name

    - Seats
        - Id
        - RoomId
        - Row
        - Number




- Lịch chiếu
    - Showtimes
        - Id
        - MovieId
        - RoomId
        - StartTime
        - Price




- Đặt vé
    - Bookings
        - Id
        - UserId
        - ShowtimeId
        - TotalPrice
        - Status (PENDING, PAID, CANCELLED)
        - CreatedAt

    - BookingSeats
        - Id
        - BookingId
        - SeatId




- Social (review + tương tác)
    - Reviews
        - Id
        - UserId
        - MovieId
        - Content
        - Rating
        - CreatedAt

    - Comments
        - Id
        - UserId
        - ReviewId
        - Content
        - CreatedAt

    - Likes
        - Id
        - UserId
        - ReviewId




1. Flow hệ thống
    1. (A) Xem phim + đặt vé
User vào trang
→ xem danh sách phim
→ chọn phim
→ xem lịch chiếu
→ chọn suất chiếu
→ chọn ghế

[Quan trọng]
→ gọi API lock ghế (tạm giữ 2-5 phút)
→ confirm đặt vé
→ tạo Booking + BookingSeats
→ update trạng thái ghế
    2. (B) Lock ghế realtime
        1. Khi user chọn ghế: Client → API lock seat
→ lưu Redis (seatId + showtimeId + expire 5 phút)
→ trả về OK
        2. Nếu người khác chọn: → check Redis
→ nếu đã lock → không cho chọn

    3. (C) Review phim (social)
User xem phim
→ viết review + rating → 
người khác:
        - like
        - comment

    4. (D) Feed (giống social)
Hiển thị:
        - review mới nhất
        - review từ người follow
        - phim hot

    5. (E) Notification
Khi có:
        -  người comment 
        -  người like
 → gửi realtime (SignalR)


2. 
3. 




