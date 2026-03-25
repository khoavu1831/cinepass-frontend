function HeaderTypeRank({ context, icon }) {
  return (
    <>
      <div className="flex items-center py-4">
        <i className={`fa-solid ${icon} text-[16px] text-mainblue`}></i>
        <h1 className="text-white font-medium uppercase ml-2">{context}</h1>
      </div>
    </>
  )
}

export default HeaderTypeRank
