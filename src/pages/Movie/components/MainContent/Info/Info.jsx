import { useState } from "react";
import RowDetailsMovie from "./RowMovieDetails";

const formatRuntime = (runtime) => {
  if (!runtime) return null;
  const h = Math.floor(runtime / 60);
  const m = runtime % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

function Info({ movie, loading }) {
  const [toggle, setToggle] = useState(false);

  if (loading) {
    return (
      <div className="container-info relative flex justify-center max-xl:px-4 z-10 xl:w-full">
        <div className="animate-pulse flex flex-col items-center gap-4 w-full">
          <div className="w-30 h-45 xl:w-40 xl:h-60 bg-gray-700 rounded-2xl"></div>
          <div className="h-6 w-48 bg-gray-700 rounded"></div>
          <div className="h-4 w-32 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  // Support both backend format and TMDB format
  const posterUrl = movie.posterUrl || movie.poster_path
    ? (movie.posterUrl || `https://image.tmdb.org/t/p/w342${movie.poster_path}`)
    : "/vietnam.png";

  const year = (movie.releaseDate || movie.release_date)?.slice(0, 4) ?? "--";
  const runtime = formatRuntime(movie.duration || movie.runtime);

  // Backend: genres is string[], TMDB: genres is [{id, name}]
  const genres = Array.isArray(movie.genres)
    ? movie.genres.map(g => (typeof g === "string" ? { id: g, name: g } : g))
    : [];

  // Backend: cast is "Actor1, Actor2, ..."
  const castList = movie.cast
    ? (typeof movie.cast === "string"
      ? movie.cast.split(",").map(name => name.trim()).filter(Boolean)
      : movie.cast)
    : [];

  // Director
  const director = movie.director
    || movie.credits?.crew?.find(p => p.job === "Director")?.name;

  const overview = movie.description || movie.overview;

  const ratingAvg = movie.ratingAvg || movie.vote_average;

  return (
    <>
      <div className="container-info relative flex justify-center max-xl:px-4 z-10 xl:w-full">
        <div className="wrapper-info flex flex-col justify-center max-xl:items-center">

          <div className="cover-poster w-30 h-45 xl:w-40 xl:h-60">
            <img
              className="w-full h-full object-cover rounded-2xl"
              src={posterUrl}
              alt={movie.title}
            />
          </div>

          <div className="title text-white mt-4 text-xl xl:text-2xl xl:font-bold">
            <h1>{movie.title}</h1>
          </div>

          {movie.localTitle && (
            <div className="subTitle text-gray-400 xl:text-mainblue xl:mb-6 mt-1 text-[14px]">
              <h4>{movie.localTitle}</h4>
            </div>
          )}

          <div className="btn-more xl:hidden text-mainblue text-[14px] my-4 cursor-pointer">
            <button onClick={() => setToggle(!toggle)}>
              <span>Thông tin phim</span>
              <i className="fa-solid fa-angle-down"></i>
            </button>
          </div>

          <div className={`min-w-full xl:block mb-8 ${toggle ? "block" : "hidden"}`}>

            <div className="tags xl:mb-3">
              <div className="flex text-[10px] gap-1.5 text-white md:text-[12px] items-center">
                <div className="rounded-md px-1.5 py-1 lg:px-1.5 lg:py-1.5 bg-mainblue text-white font-bold">
                  <span>HD</span>
                </div>
                {year && (
                  <div className="rounded-md px-1.5 py-1 lg:px-1.5 lg:py-1.5 bg-[#ffffff10] border">
                    <span>{year}</span>
                  </div>
                )}
                {runtime && (
                  <div className="border rounded-md px-1 py-1 lg:px-1.5 lg:py-1.5 bg-[#ffffff10]">
                    <span>{runtime}</span>
                  </div>
                )}
                {ratingAvg > 0 && (
                  <div className="border rounded-md px-1 py-1 lg:px-1.5 lg:py-1.5 bg-[#ffffff10]">
                    <span>⭐ {Number(ratingAvg).toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            {genres.length > 0 && (
              <div className="flex flex-wrap text-white gap-1.5 text-[12px] py-3">
                {genres.map(g => (
                  <span key={g.id} className="py-1 px-2 bg-[#ffffff10] rounded">{g.name}</span>
                ))}
              </div>
            )}

            {overview && (
              <div className="flex flex-col text-[14px] mb-4">
                <h2 className="text-white font-semibold my-2">Giới thiệu:</h2>
                <span className="text-gray-500">{overview}</span>
              </div>
            )}

            {runtime && <RowDetailsMovie label={"Thời lượng"} contents={[runtime]} />}
            {director && <RowDetailsMovie label={"Đạo diễn"} contents={[director]} />}
            {castList.length > 0 && <RowDetailsMovie label={"Diễn viên"} contents={castList.slice(0, 5)} />}
          </div>

          {castList.length > 0 && (
            <div className="max-xl:hidden flex flex-col">
              <div className="text-white text-xl font-bold mb-4">
                <h1>Diễn viên</h1>
              </div>
              <div className="flex flex-col gap-2">
                {castList.slice(0, 9).map((name, i) => (
                  <div key={i} className="flex items-center gap-2 text-white text-sm">
                    <div className="w-8 h-8 rounded-full bg-mainblue flex items-center justify-center text-xs font-bold">
                      {name[0]}
                    </div>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Info