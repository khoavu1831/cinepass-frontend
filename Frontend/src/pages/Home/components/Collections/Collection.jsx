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
      <div className={`px-4 ${isTopMovies && "xl:flex xl:items-start xl:gap-8"}`}>
        {/* Thumbnail */}
        <div className={`flex w-full 
          ${isTopMovies
            ? "xl:pb-13.75 max-xl:items-center max-xl:justify-between xl:flex-col xl:justify-end max-xl:mb-4"
            : "items-center max-sm:justify-between mb-4"}`}
        >

          {/* Title */}
          <div className="text-[22px] sm:text-[25px] xl:text-[32px] font-medium text-white">
            {titleCollection}
          </div>

          {/* Icon-more*/}
          <div className={`group flex items-center text-white sm:ml-5 cursor-pointer hover:text-mainblue transition-all duration-300
              ${isTopMovies ? "xl:ml-0 xl:mt-4" : "rounded-full border border-[#646161]"}
            `}
          >
            {/* Label */}
            {isTopMovies ? (
              <h2 className={`max-sm:hidden text-[14px] font-light`}>
                Xem toàn bộ
              </h2>
            ) : (
              <h2 className={`max-sm:hidden whitespace-nowrap overflow-hidden max-w-0 transition-all duration-700 
                  text-[13px] font-light opacity-0 group-hover:opacity-100 group-hover:max-w-100 group-hover:pl-4`}
              >
                Xem thêm
              </h2>
            )}
            <a
              href=""
              className={`w-8 h-8 flex justify-center items-center group-hover:border-transparent
                  ${isTopMovies ? "" : "rounded-full border border-[#646161]"}`
              }
            >
              <i className="fa-solid fa-angle-right"></i>
            </a>
          </div>
        </div>

        {/* Slide nav */}
        <div className={`${isTopMovies ? "hidden" : "max-xl:hidden relative text-white text-4xl"}`}>
          <button
            ref={preRef}
            className={`absolute cursor-pointer z-50 -left-10
              ${isBeginning ? "opacity-0 pointer-events-none" : "opacity-40 hover:opacity-100"}
              ${isVertical ? "top-38" : "top-20"}`}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <button
            ref={nextRef}
            className={`absolute cursor-pointer z-50 -right-10
              ${isEnd ? "opacity-0 pointer-events-none" : "opacity-40 hover:opacity-100"}
              ${isVertical ? "top-38" : "top-20"}`}
          >
            <i className="fa-solid fa-chevron-right"></i>
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
          className="pb-40! -mb-40! z-999"
        >

          {movies.map((m) => (
            <SwiperSlide key={m.id}>
              <Card movie={m} variant={variant} type={type} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div >
    </>
  )
}

export default Collection