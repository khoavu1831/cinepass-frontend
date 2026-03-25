function BottomSlider({ movies, active, setActive }) {
  return (
    <div className="sm:absolute right-[10%] top-[80%] lg:top-[86%] xl:top-[70%] xl:right-17.5 pt-3 pb-3">
      <div className="flex justify-center gap-2">
        {movies.slice(0, 6).map((m, i) => (
          <button key={m.id} onClick={() => setActive(i)} className="p-1 cursor-pointer">
            <img
              src={m.avatar}
              className={`w-7.5 h-7.5 xl:h-10.25 xl:w-16.5 xl:rounded object-cover border-2 rounded-full transition 
                ${i === active ? "border-mainblue" : "border-[#4a537c]"}`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default BottomSlider;
