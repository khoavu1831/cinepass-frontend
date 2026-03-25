import CardTop from "../../../../components/Cards/CardTop"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import { useState, useRef } from "react"

function CollectionTopMovie({ movies, titleCollection, type }) {
  const isTopMovies = type === "top-movies";
  const preRef = useRef(null);
  const nextRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false)

  return (
    <>
      <div className={`px-4 ${isTopMovies && "xl:flex"}`}>
        {/* Thumbnail */}
        <div className={`flex w-full 
          ${isTopMovies
            ? "xl:pb-13.75 max-xl:items-center max-xl:justify-between xl:flex-col xl:justify-end max-xl:mb-4"
            : "items-center max-sm:justify-between mb-4"}`}>

          {/* Title */}
          <div className="text-[22px] sm:text-[25px] xl:text-[32px] font-medium text-white max-w-[86%]">
            {titleCollection}
          </div>
        </div>

        {/* Slide nav */}
        <div className="max-md:hidden relative text-white text-4xl">
          <button
            ref={preRef}
            className={`absolute cursor-pointer z-50 xl:-left-10 top-66
              ${isBeginning ? "opacity-0 pointer-events-none" : "opacity-40 hover:opacity-100"}`}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <button
            ref={nextRef}
            className={`absolute cursor-pointer z-50 xl:-right-10 top-66
              ${isEnd ? "opacity-0 pointer-events-none" : "opacity-40 hover:opacity-100"}`}
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
          spaceBetween={0}
          slidesPerView={1}
          breakpoints={{
            425: {
              slidesPerView: 2,
              spaceBetween: 10
            },
            768:
            {
              slidesPerView: 3,
              spaceBetween: 10
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 10
            },
            1440: {
              slidesPerView: 5,
              spaceBetween: 10
            }
          }}
          className="pb-40! -mb-40!"
        >
          {movies.map((m, index) => (
            <SwiperSlide key={m.id}>
              <CardTop movie={m} index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  )
}

export default CollectionTopMovie