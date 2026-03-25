import { useState } from "react";
import TopSlider from "./TopSlider";
import BottomSlider from "./BottomSlider";

function Slider({ movies }) {
  const [active, setActive] = useState(0);
  
  return (
    <>
      <div className="w-full sm:relative">
        <div className="max-sm:max-h-75 flex flex-col bg-[#1b1d29]">
          <TopSlider movies={movies} active={active} setActive={setActive} />
          <BottomSlider movies={movies} active={active} setActive={setActive}/>
        </div>
      </div>
    </>
  );
}

export default Slider
