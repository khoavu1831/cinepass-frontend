function RowMovieDetails({ label, contents }) {
  return (
    <>
      <div className="networks flex flex-start gap-2 text-[14px] mb-4">
        <h2 className="text-white font-semibold">{label}:</h2>

        <div className="vlue gap-1">
          {contents.map(m => (
            <span key={m} className="text-white font-light line-clamp-2">{m}</span>
          ))}
        </div>
      </div>
    </>
  )
}

export default RowMovieDetails