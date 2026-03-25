function BottomSliderAnime({ movies, active, setActive }) {
  return (
    <div className="flex justify-center z-2 max-sm:mb-6">
      <div className="absolute lg:top-[80%] xl:top-[86%] pt-3 pb-3">
        <div className="flex justify-center gap-2 xl:gap-4">
          {movies.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActive(i)}
              className="cursor-pointer"
            >
              <div
                className={`lg:hidden w-3 h-3 max-sm:w-2 max-sm:h-2 rounded-full transition 
                ${i === active ? "bg-[#f9d86b]" : "bg-gray-300"}`}
              />

              <img
                src={m.avatar}
                className={`hidden lg:block w-12 h-12 xl:h-22 xl:w-16 xl:rounded-xl object-cover border-2 rounded-full transition
                ${i === active ? "border-mainblue" : "border-[#4a537c]"}`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BottomSliderAnime;
