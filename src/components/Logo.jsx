import { Link } from "react-router-dom"

function Logo({ movieSvg }) {
  return (
    <div className="cursor-pointer max-xl:ml-4">
      <Link to={"/"} className="flex items-center">
        <img className="h-13" src={movieSvg} alt="logo" />
        <h3 className="font-semibold text-white text-[18px]">CinePass</h3>
        <span className="font-mono text-gray-400 text-[12px]">pro</span>
      </Link>
    </div>
  )
}

export default Logo