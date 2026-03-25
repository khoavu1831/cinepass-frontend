import Tabs from "../../Movie/components/MainContent/Tabs/Tabs"
import CastCol from "../../Movie/components/MainContent/Info/CastCol"

function Main() {
  return (
    <div className="relative bg-[#1b1d29]">
      {/* Watch Player */}
      <div className="watch-player flex flex-col md:flex-col-reverse lg:px-4">

        {/* Container movie player and action buttons */}
        <div className="flex flex-col lg:rounded-xl lg:overflow-hidden">

          {/* Frame */}
          <div className="aspect-video">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
            >
            </iframe>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between w-full text-white bg-black py-2 px-2">

            {/* Left buttons */}
            <div className="flex gap-3">

              {/* Love button */}
              <div className="flex px-2 py-3 justify-center items-center">
                <i className="fa-solid fa-heart h-3 w-3"></i>
                <span className="hidden md:block">Yêu thích</span>
              </div>

              {/* Add button */}
              <div className="flex px-2 py-3 justify-center items-center">
                <i class="fa-solid fa-plus h-3 w-3"></i>
                <span className="hidden md:block">Thêm vào</span>
              </div>

              {/* Watch together button */}
              <div className="flex px-2 py-3 justify-center items-center">
                <i class="fa-solid fa-tower-broadcast h-3 w-3"></i>
                <span className="hidden md:block">Xem chung</span>
              </div>

              {/* Share button */}
              <div className="flex px-2 py-3 justify-center items-center">
                <i className="fa-solid fa-paper-plane h-3 w-3"></i>
                <span className="hidden md:block">Chia sẻ</span>
              </div>
            </div>

            {/* Right buttons */}
            <div className="flex justify-center items-center">

              {/* Report button */}
              <div className="flex px-2 py-3 justify-center items-center">
                <i class="fa-solid fa-flag h-3 w-3"></i>
                <span className="hidden md:block">Báo lỗi</span>
              </div>
            </div>

          </div>
        </div>

        {/* Button Back Info movie */}
        <div className="
          md:relative md:mt-17.5 md:py-4 md:px-4 
          mt-4 flex items-center gap-1 w-full bg-none text-white font-medium text-[14px] px-2 md:bg-[#0f111a] lg:bg-[#1b1d29]"
        >
          <div className="flex justify-center items-center w-8 h-8 rounded-full border mr-2">
            <i className="fa-solid fa-angle-left text-[12px]"></i>
          </div>
          <h1 className="md:text-[20px] md:font-semibold">Xem phim
            <span> Phi Vụ Thế Kỉ 2</span>
          </h1>
        </div>
      </div>

      {/* Info Container */}
      <div className="px-4 xl:flex xl:divide-x divide-gray-400/50">

        {/* Tabs */}
        <div className="xl:p-8 w-full">
          <Tabs isWatch={true} />
        </div>

        {/* More */}
        <div className="flex flex-col divide-y divide-gray-400/50 gap-4 xl:p-8 xl:min-w-100">

          {/* Rate */}
          <div className="flex justify-between items-center py-2">

            {/* Rate + Comment */}
            <div className="flex gap-4 text-[18px] text-white py-2">

              <div className="flex gap-2 flex-col items-center cursor-pointer">
                <i class="fa-solid fa-star"></i>
                <span className="text-[12px]">Đánh giá</span>
              </div>

              <div className="border-l border-gray-400/50"></div>

              <div className="flex gap-2 flex-col items-center cursor-pointer">
                <i class="fa-solid fa-comment-dots"></i>
                <a href="#comment" className="text-[12px]">Bình luận</a>
              </div>
            </div>

            {/* Rate - button */}
            <div className="md:pl-6 xl:min-w-40">
              <button className="bg-[#1a2c7e] flex items-center gap-1 justify-around rounded-4xl px-3 py-1.5 lg:py-4 cursor-pointer">
                <img
                  src="movie.svg"
                  className="w-6 h-6 object-cover"
                />

                <span className="text-white font-semibold">9.0</span>

                <a
                  href=""
                  className="text-white text-[12px] underline"
                >Đánh giá
                </a>
              </button>
            </div>
          </div>

          {/* Cast */}
          <div className="py-4">
            {/* Heading - Cast*/}
            <div className="text-white text-xl font-bold mb-4">
              <h1>Diễn viên</h1>
            </div>

            {/* Cast Avatar */}
            <div className="grid grid-cols-3 justify-items-center gap-3 gap-y-6">
              <CastCol />
              <CastCol />
              <CastCol />
              <CastCol />
              <CastCol />
              <CastCol />
              <CastCol />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main