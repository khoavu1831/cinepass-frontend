import Card from "../../../../components/Cards/Card"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import { useRef, useState } from "react"

function Collection({ movies, titleCollection, variant, type }) {
  const isVertical = variant === "vertical";
  const isTopMovies = type === "top-movies";
  const preRef = useRef(null);
  const nextRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false)

  return (
    <>
      <div className={`px-4 relative ${isTopMovies ? "xl:flex xl:items-start xl:gap-8" : ""}`}>
        {/* Thumbnail / Header */}
        <div className={`flex w-full items-center mb-4 ${isTopMovies ? "justify-between xl:w-50 xl:min-w-50 xl:pb-13.75 xl:flex-col xl:justify-end xl:items-start xl:mb-0" : "max-sm:justify-between"}`}>

          {/* Title */}
          <div className={`text-[22px] sm:text-[25px] xl:text-[32px] font-medium text-white ${isTopMovies ? "xl:leading-tight" : ""}`}>
            {titleCollection}
          </div>

          {/* Icon-more*/}
          <div className={`group flex items-center text-white cursor-pointer hover:text-mainblue transition-all duration-300 ${isTopMovies ? "xl:mt-4" : "sm:ml-5 rounded-full border border-[#646161]"}`}>
            {/* Label */}
            {isTopMovies ? (
              <h2 className="text-[13px] sm:text-[14px] font-light">
                Xem toàn bộ
              </h2>
            ) : (
              <h2 className="max-sm:hidden whitespace-nowrap overflow-hidden max-w-0 transition-all duration-700 text-[13px] font-light opacity-0 group-hover:opacity-100 group-hover:max-w-[100px] group-hover:pl-4">
                Xem thêm
              </h2>
            )}

            <a
              href=""
              className={`flex justify-center items-center ${isTopMovies ? "ml-1 xl:ml-2" : "w-8 h-8 rounded-full border border-[#646161] group-hover:border-transparent"}`}
            >
              <i className="fa-solid fa-angle-right"></i>
            </a>
          </div>
        </div>

        {/* Slider Wrapper */}
        <div className="relative w-full flex-1 min-w-0">
          <div
            className={`
              max-md:hidden absolute w-full left-0 right-0 z-50 text-white text-4xl pointer-events-none
              ${isTopMovies
                ? "top-[30%]"
                : "top-[20%]"} 
              `}
          >
            <button
              ref={preRef}
              className={`
                absolute cursor-pointer pointer-events-auto max-xl:hidden 
                ${isTopMovies
                  ? `bg-white text-black rounded-full text-sm p-2 -left-4 ${isBeginning ? "opacity-0" : "opacity-100 hover:opacity-40"}`
                  : `-left-10 ${isBeginning ? "opacity-0" : "opacity-40 hover:opacity-100"}`
                }
                `}
            >
              <i className="fa-solid fa-chevron-left drop-shadow-md"></i>
            </button>

            <button
              ref={nextRef}
              className={`
                absolute cursor-pointer pointer-events-auto max-xl:hidden 
                ${isTopMovies
                  ? `bg-white text-black rounded-full text-sm p-2 -right-4 ${isEnd ? "opacity-0" : "opacity-100 hover:opacity-40"}`
                  : `-right-10 ${isEnd ? "opacity-0" : "opacity-40 hover:opacity-100"}`
                }
                `}
            >
              <i className="fa-solid fa-chevron-right drop-shadow-md"></i>
            </button>
          </div>

          <Swiper
            modules={[Navigation]}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = preRef.current,
                swiper.params.navigation.nextEl = nextRef.current
            }}
            onSwiper={(swiper) => {
              requestAnimationFrame(() => {
                setIsBeginning(swiper.isBeginning)
                setIsEnd(swiper.isEnd)
              })
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning)
              setIsEnd(swiper.isEnd)
            }}
            onResize={(swiper) => {
              setIsBeginning(swiper.isBeginning)
              setIsEnd(swiper.isEnd)
            }}
            spaceBetween={10}
            slidesPerView={isVertical ? 3 : 2}
            breakpoints={{
              768: { slidesPerView: isVertical ? 4 : 2 },
              1024: { slidesPerView: isVertical ? 5 : 3 },
              1440: { slidesPerView: isVertical ? 8 : 5 }
            }}
            className="pb-40! -mb-40! z-999 w-full flex-1 min-w-0"
          >
            {movies.map((m) => (
              <SwiperSlide key={m.id}>
                <Card movie={m} variant={variant} type={type} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  )
}

export default Collection