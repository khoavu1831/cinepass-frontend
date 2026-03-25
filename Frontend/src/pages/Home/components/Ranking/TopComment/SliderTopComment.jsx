import { Swiper, SwiperSlide } from "swiper/react"
import HeaderTypeRank from "../HeaderTypeRank"
import CardTopComment from "./CardTopComment"

function SliderTopComment() {
  return (
    <>
      <div className="pb-8 px-6 border-b border-gray-700">
        <HeaderTypeRank context={"Top bình luận"} icon={"fa-medal"}/>

        <Swiper
          loop="true"
          spaceBetween={14}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 4 },
            1440: { slidesPerView: 5 }
          }}
        >
          <SwiperSlide><CardTopComment /></SwiperSlide>
          <SwiperSlide><CardTopComment /></SwiperSlide>
          <SwiperSlide><CardTopComment /></SwiperSlide>
          <SwiperSlide><CardTopComment /></SwiperSlide>
          <SwiperSlide><CardTopComment /></SwiperSlide>
          <SwiperSlide><CardTopComment /></SwiperSlide>
          <SwiperSlide><CardTopComment /></SwiperSlide>
          <SwiperSlide><CardTopComment /></SwiperSlide>
          <SwiperSlide><CardTopComment /></SwiperSlide>
          <SwiperSlide><CardTopComment /></SwiperSlide>
        </Swiper>
      </div>
    </>
  )
}

export default SliderTopComment