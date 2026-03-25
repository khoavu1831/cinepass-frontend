function ActionButtons({ icon, label, isComment }) {

  return (
    <a
      href={isComment && "#comment"}
      className={`love-btn group flex flex-col items-center gap-2 p-2 text-white cursor-pointer ${isComment ? "max-md:hidden" : ""}`}
    >
      <i className={`fa-solid ${icon} group-hover:text-mainblue text-[16px]`}></i>
      <h4 className="ml-2 text-nowrap text-[12px]">{label}</h4>
    </a>
  )
}

export default ActionButtons