function ForgetPassword({ onSwitchSignin }) {
  return (
    <form
      className="flex flex-col gap-3 max-md:p-6 mb-4 p-12"
      action=""
      method="post"
    >
      <h1 className="font-semibold text-xl">Quên mật khẩu</h1>
      <p className="max-md:text-[12px] text-[15px] mb-3">Nếu bạn đã có tài khoản, 
        <span
          className="text-mainblue cursor-pointer ml-1"
          onClick={onSwitchSignin}
        >đăng nhập ngay
        </span>
      </p>
      <input
        className="py-3 pl-4 border placeholder-gray-400 text-gray-400 rounded-md text-sm max-md:text-[12px]"
        placeholder="Email đã đăng ký"
        type="text"
        name=""
        id=""
      />
      <button className="bg-mainblue py-2 px-4 rounded-md text-sm mt-3 cursor-pointer">Gửi yêu cầu</button>
    </form>
  )
}

export default ForgetPassword