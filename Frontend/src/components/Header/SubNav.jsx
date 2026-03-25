import { useEffect, useState } from "react";

function SubNav({ data, isOpen, col, responsive }) {
  const [gridCol, setGridCol] = useState(col);
  const [cellWidth, setCellWidth] = useState(130);

  // Handle resize col Genres in MenuItems
  useEffect(() => {
    if (!responsive) return;
    const handleResize = () => {
      const w = window.innerWidth;
      if (w <= 425) return (setGridCol(3), setCellWidth(95));
      if (w < 1024) return (setGridCol(5), setCellWidth(120));

      setGridCol(col);
      setCellWidth(130);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [col, responsive]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 max-sm:-left-4 xl:mt-6 bg-[#0f111a]/90 rounded font-light shadow-lg z-50">
      <div
        className="grid text-[13px] px-2 py-4 gap-1"
        style={{
          gridTemplateColumns: `repeat(${gridCol}, ${cellWidth}px)`
        }}
      >
        {data.map((genreName) => (
          <span
            key={genreName}
            className="p-2 truncate hover:bg-[#22242c] rounded hover:text-mainblue cursor-pointer text-white"
          >
            {genreName}
          </span>
        ))}
      </div>
    </div>
  )
}

export default SubNav