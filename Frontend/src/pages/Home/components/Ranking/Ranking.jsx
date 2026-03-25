import SliderTopComment from "./TopComment/SliderTopComment"
import SliderNewComment from "./NewComment/SliderNewComment"
import TypeRank from "./Type/TypeRank"

function Ranking({ movies }) {
  return (
    <>
      <div className="container-ranking w-full">
        <div className="m-4 border rounded-2xl border-gray-700 overflow-hidden">
          {/* Comment top - xl*/}
          <SliderTopComment />

          <div
            className="grid max-xl:grid-flow-col
              lg:grid-rows-2 xl:grid-rows-1 xl:grid-cols-4
              max-sm:auto-cols-[100%] md:auto-cols-[80%] lg:auto-cols-[50%]
              overflow-x-auto 
              md:divide-x divide-gray-700"
          >
            {/* Hotest movies - sm -> xl*/}
            <TypeRank context={"SÔi nổi nhất"} icon={"fa-fire"} movies={movies} />

            {/* Lovest movies - sm -> xl*/}
            <TypeRank context={"Yêu thích nhất"} icon={"fa-heart-circle-check"} movies={movies} />

            {/* Genre - sm ->  lg*/}
            <TypeRank context={"Thể loại hot"} icon={"fa-clipboard-list"} movies={movies} />

            {/* Comment new - xl */}
            <SliderNewComment />
          </div>
        </div>
      </div>
    </>
  )
}

export default Ranking