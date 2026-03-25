import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import HeaderTypeRank from "../HeaderTypeRank"
import CommentItem from "./CommentItem"
function SliderNewComment() {
  return (
    <>
      <div className="flex flex-col px-6 pb-5 text-white">
        <HeaderTypeRank context={"Bình luận mới"} icon={"fa-bolt"} />

        {/* List comment */}
        <Swiper
          direction="vertical"
          loop="true"
          slidesPerView={4}
          mousewheel
          className="h-70 w-full!"
        >
          <SwiperSlide><CommentItem /></SwiperSlide>
          <SwiperSlide><CommentItem /></SwiperSlide>
          <SwiperSlide><CommentItem /></SwiperSlide>
          <SwiperSlide><CommentItem /></SwiperSlide>
          <SwiperSlide><CommentItem /></SwiperSlide>
          <SwiperSlide><CommentItem /></SwiperSlide>
          <SwiperSlide><CommentItem /></SwiperSlide>
          <SwiperSlide><CommentItem /></SwiperSlide>
          <SwiperSlide><CommentItem /></SwiperSlide>
          <SwiperSlide><CommentItem /></SwiperSlide>
          <SwiperSlide><CommentItem /></SwiperSlide>
          <SwiperSlide><CommentItem /></SwiperSlide>
        </Swiper>
      </div>
    </>
  )
}

export default SliderNewComment