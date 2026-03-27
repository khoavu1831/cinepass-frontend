import { useState, useEffect, useCallback } from "react"
import Button from "./Button";
import Fieldset from "./Fieldset";
import Card from "../../../components/Cards/Card";
import Pagination from "./Pagination";
import { fetchApi } from "../../../api/http";
import { TMDB_BASE_URL } from "../../../api/tmdb";

function Main() {
  const [type, setType] = useState("phim");
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    country: ['Tất cả'],
    type: ['Tất cả'],
    rating: ['Tất cả'],
    genre: ['Tất cả'],
    year: ['Tất cả'],
    sort: 'Mới nhất'
  });

  // Convert movies from API format to app format
  const mapMovieData = (item) => {
    const isMovie = item.title !== undefined;
    return {
      id: item.id,
      title: item.title || item.name,
      subTitle: item.original_title || item.original_name,
      avatar: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "skeleton_poster.webp",
      poster: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : "skeleton_poster.webp",
      subtitle: item.original_language?.toUpperCase() || "EN",
      dub: Math.min(Math.round(item.vote_average), 10).toString(),
      info: {
        imdb: Math.round(item.vote_average * 10) / 10,
        resolution: "Full HD",
        ageLimit: "P16",
        year: isMovie ? item.release_date?.split('-')[0] : item.first_air_date?.split('-')[0],
        duration: "120 phút",
        genres: [{ id: 1, name: "Action" }]
      }
    };
  };

  // Fetch movies based on current page and filters
  const fetchMovies = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      let url = `${TMDB_BASE_URL}/discover/${type === "phim" ? "movie" : "tv"}?language=vi-VN&page=${page}`;
      
      // Add sorting
      if (filters.sort === 'Mới nhất') {
        url += "&sort_by=release_date.desc";
      } else if (filters.sort === 'Điểm IMDb') {
        url += "&sort_by=vote_average.desc&vote_count.gte=100";
      } else if (filters.sort === 'Lượt xem') {
        url += "&sort_by=popularity.desc";
      }

      url += "&region=VN";

      const response = await fetchApi(url);
      
      const mappedMovies = response.results.map(mapMovieData);
      setMovies(mappedMovies);
      setTotalPages(Math.min(response.total_pages, 50));
      setCurrentPage(page);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  }, [type, filters]);

  // Fetch movies when page changes
  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage, fetchMovies]);

  // Handle page change from pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Update filters and reset to page 1
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="search-container py-28 h-full bg-[#1b1d29]">
      <div className="content px-5">
        {/* header */}
        <div className="rows-header text-2xl font-medium text-white flex items-center gap-2">
          <i className="fa-solid fa-sliders"></i>
          <h1>Kết quả tìm kiếm "{type === "phim" ? "Phim" : "Diễn viên"}"</h1>
        </div>

        {/* main content */}
        <div className="main-content">
          {/* type filter: movie / cast */}
          <div className="toggle-btns flex gap-2 py-5">
            <Button
              active={type === "phim"}
              onClick={() => {
                setType("phim");
                setCurrentPage(1);
              }}
              label={"Phim"}
            />
            <Button
              active={type === "dv"}
              onClick={() => {
                setType("dv");
                setCurrentPage(1);
              }}
              label={"Diễn viên"}
            />
          </div>

          {/* advanced filter */}
          <div className="filter">
            <Fieldset onFilterChange={handleFilterChange} filters={filters} />
          </div>

          {/* result movies */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-gray-400">Đang tải...</div>
            </div>
          ) : movies.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4 py-8">
                {movies.map((movie) => (
                  <Card key={movie.id} movie={movie} variant="vertical" type="search" />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="flex justify-center items-center py-20">
              <div className="text-gray-400">Không tìm thấy kết quả</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Main