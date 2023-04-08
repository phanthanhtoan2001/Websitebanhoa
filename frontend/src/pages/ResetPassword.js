import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import loginImage from '../assets/login-user.gif'
import { BiShow, BiHide } from 'react-icons/bi'

const ResetPassword = () => {
    // Thiết lập trạng thái cho OTP và mật khẩu mới
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false) //state để hiển thị hoặc ẩn mật khẩu khi đăng nhập

    // Nhận mã thông báo từ thông số URL và thiết lập điều hướng
    const { token } = useParams()
    const navigate = useNavigate()

    // Cập nhật trạng thái cho OTP và mật khẩu mới khi người dùng nhập vào trường nhập liệu
    const handleOtpChange = (event) => {
        setOtp(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setNewPassword(event.target.value)
    }

    const handleShowPassword = () => { //Hàm để toggle hiển thị/ẩn mật khẩu
        setShowPassword(prev => !prev)
    }

    // Xử lý gửi biểu mẫu khi người dùng gửi biểu mẫu để đặt lại mật khẩu của họ
    const handleSubmit = async (event) => {
        event.preventDefault()

        // Kiểm tra xem trường OTP và mật khẩu có trống không
        if (!otp || !newPassword) {
            alert('Please enter OTP and password!')
            return
        }

        // Kiểm tra xem mật khẩu có chứa ít nhất một chữ số, một ký tự đặc biệt và dài hơn 6 ký tự không
        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&-*+/_])(?=.*[a-zA-Z]).{6,}$/
        if (!passwordRegex.test(newPassword)) {
            alert('Password must contain at least one digit, one special character, and be longer than 6 characters.')
            return
        }

        try {
            // Gửi yêu cầu server xác thực OTP và reset mật khẩu
            const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, otp, newPassword }),
            })
            // Nếu phản hồi không ổn, ném lỗi
            if (!response.ok) {
                throw new Error('Failed to reset password')
            }

            // Nếu phản hồi OK, hiển thị thông báo thành công và điều hướng đến trang đăng nhập
            const data = await response.json()
            alert(data.message)
            navigate('/login')
        } catch (error) {
            console.log(error)
            alert('Failed to reset password!')
        }
    }

    return (
        <>
            <section>
                <div className="p-5 md:p-10">
                    <div className="w-full max-w-[800px] max-w-sm bg-white m-auto flex items-center flex-col p-2">
                        <h1 className="text-center text-2xl font-bold" style={{ fontSize: '24px' }}>
                            New Password
                        </h1>
                        <div className="w-40 overflow-hidden rounded-full drop-shadow-md shadow-md">
                            <img src={loginImage} className="w-full" alt="Login" />
                        </div>
                        <form className="w-full py-3 flex flex-col" onSubmit={handleSubmit}>
                            <label htmlFor="otp">OTP</label>
                            <input
                                id="otp"
                                type="text"
                                className="mt-1 mb-2 w-full bg-slate-200 px-8 py-2 rounded-full focus-within:outline-blue-400"
                                value={otp}
                                onChange={handleOtpChange}
                            />

                            <label htmlFor="newpassword">New Password</label>
                            <div className='flex px-2 py-1 bg-slate-200 mt-1 mb-2 rounded-full outline-none focus-within:outline-blue-400'>
                                <input
                                    id="newpassword"
                                    type={showPassword ? "text" : "password"}
                                    className="mt-1 mb-2 w-full bg-slate-200 px-8 py-2 rounded-full focus-within:outline-blue-400"
                                    value={newPassword}
                                    onChange={handlePasswordChange}
                                />
                                <span className='flex text-2xl py-3 cursor-pointer' onClick={handleShowPassword}>{showPassword ? <BiShow /> : <BiHide />}</span>
                            </div>

                            <div
                                style={{ display: 'flex', justifyContent: 'center' }}
                                className='flex py-3'>
                                <button className='w-full max-w-[150px] bg-blue-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full'>
                                    Reset Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ResetPassword
