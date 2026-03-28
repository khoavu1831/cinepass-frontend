function Signup({ onSwitchSignin }) {
  return (
    <form
      className="flex flex-col gap-3 max-md:p-6 mb-4 p-12"
      action=""
      method="post"
    >
      <h1 className="font-semibold text-xl">Đăng ký</h1>
      <p className="max-md:text-[12px] text-[15px] mb-3">Nếu bạn đã có tài khoản,
        <span
          onClick={onSwitchSignin}
          className="text-mainblue cursor-pointer ml-1"
        > đăng nhập ngay
        </span>
      </p>
      <input
        className="py-3 pl-4 border placeholder-gray-500 text-gray-500 rounded-md text-sm max-md:text-[12px]"
        placeholder="Tên hiển thị"
        type="text"
        name=""
        id=""
      />
      <input
        className="py-3 pl-4 border placeholder-gray-500 text-gray-500 rounded-md text-sm max-md:text-[12px]"
        placeholder="Email"
        type="text"
        name=""
        id=""
      />
      <input
        className="py-3 pl-4 border placeholder-gray-500 text-gray-500 rounded-md text-sm max-md:text-[12px]"
        placeholder="Mật khẩu"
        type="text"
        name=""
        id=""
      />
      <input
        className="py-3 pl-4 border placeholder-gray-500 text-gray-500 rounded-md text-sm max-md:text-[12px]"
        placeholder="Nhập lại mật khẩu"
        type="text"
        name=""
        id=""
      />
      <button className="bg-mainblue py-2 px-4 rounded-md text-sm mt-3 cursor-pointer">Đăng ký</button>
    </form>
  )
}

export default Signup