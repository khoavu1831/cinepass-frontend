function Tab({ id, active, setActive }) {
  const isActive = id === active;
  const titles = {
    "episodes": "Tập phim",
    "gallery": "Galley",
    "cast": "Diễn viên",
    "suggest": "Đề xuất"
  };
  const title = titles[id];

  return (
    <>
      {/* Tab menu */}
      <div className="flex justify-start gap-4 text-[13px] text-white">
        <div className={`py-3 border-b ${isActive ? "border-mainblue" : "border-transparent"}`}>
          <button
            className=""
            onClick={() => setActive(id)}
          >
            <span>{title}</span>
          </button>
        </div>
      </div>
    </>
  )
}

export default Tab