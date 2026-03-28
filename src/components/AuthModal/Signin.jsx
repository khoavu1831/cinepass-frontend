function Signin({ onSwitchSignup, onSwitchForgetPassword }) {
  return (
    <form
      className="flex flex-col gap-3 max-md:p-6 mb-4 p-12"
      action=""
      method="post"
    >
      <h1 className="font-semibold text-xl">Đăng nhập</h1>
      <p className="max-md:text-[12px] text-[15px] mb-3">Nếu bạn chưa có tài khoản,
        <span
          className="text-mainblue cursor-pointer ml-1"
          onClick={onSwitchSignup}
        >đăng ký ngay
        </span>
      </p>
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
      <button className="bg-mainblue py-2 px-4 rounded-md text-sm mt-3 cursor-pointer">Đăng nhập</button>
      <span
        className="m-auto cursor-pointer text-gray-300 text-sm max-md:text-[12px]"
        onClick={onSwitchForgetPassword}
      >Quên mật khẩu?
      </span>
    </form>
  )
}

export default Signin