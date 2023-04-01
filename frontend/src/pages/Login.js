import React, { useState } from 'react'
import loginImage from '../assets/login-user.gif'
import { BiShow, BiHide } from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom' //import các module cần dùng
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from 'react-redux'
import { loginRedux } from '../redux/userSlice'


const Login = () => {
  const navigate = useNavigate() //Sử dụng hook `useNavigate` để điều hướng trang

  const [showPassword, setShowPassword] = useState(false) //state để hiển thị hoặc ẩn mật khẩu khi đăng nhập

  const [data, setData] = useState({ //state lưu trữ thông tin email và password người dùng nhập vào
    email: "",
    password: ""
  })

  const userData = useSelector(state => state) //Sử dụng hook `useSelector` để lấy toàn bộ state trong Redux store

  const dispacth = useDispatch() //Sử dụng hook `useDispatch` để gửi action đăng nhập lên Redux store

  const handleShowPassword = () => { //Hàm để toggle hiển thị/ẩn mật khẩu
    setShowPassword(prev => !prev)
  }

  const handleOnChange = (e) => { //Hàm xử lý khi người dùng thay đổi giá trị trường input
    const { name, value } = e.target
    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleSubmit = async (e) => { //Hàm xử lý khi người dùng submit form
    e.preventDefault()
    const { email, password } = data
    if (email && password) { //Nếu đầy đủ cả email và password thì gửi request lên server kiểm tra đăng nhập
      try {
        let userState = JSON.parse(localStorage.getItem(`${process.env.REACT_APP_LOCAL_STORAGE_KEY}/`))
        if (userState) {  // Kiểm tra nếu có thông tin đăng nhập trong localStorage
          dispacth(loginRedux(userState))
          setTimeout(() => {
            navigate("/")
          }, 1000)
        } else {
          const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/login`, {
            method: "POST",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify(data)
          })
          const dataRes = await fetchData.json()
          console.log(dataRes)
          // Hiển thị thông báo server trả về
          toast(dataRes.message)  // Kiểm tra response từ server để xác định thành công hay thất bại
          if (dataRes.alert) {
            //Nếu đăng nhập thành công, gửi action thông qua dispatch(), chuyển về trang chủ sau 1s
            dispacth(loginRedux(dataRes))
            setTimeout(() => {
              navigate("/")
            }, 1000)
          }
        }

      } catch (error) {
        console.log(error)
      }
    } else {
      //Nếu không đầy đủ email hoặc password, hiển thị thông báo yêu cầu nhập đủ
      alert('Please enter required fields')
    }
  }

  return (
    <div className='p-5 md:p-10'>
      <div className='w-full max-w-[800px] max-w-sm bg-white m-auto flex items-center flex-col p-2'>
        <h1 className='text-center text-2xl font-bold' style={{ fontSize: '24px' }}>Sign up</h1>
        <div className='w-40 overflow-hidden rounded-full drop-shadow-md shadow-md'>
          <img src={loginImage} className='w-full' />
        </div>
        <form className='w-full py-3 flex flex-col' onSubmit={handleSubmit}>
          <label htmlFor='email'>Email</label>
          <input type={"email"} id={"email"} name={"email"} className='mt-1 mb-2 w-full bg-slate-200 px-8 py-2 rounded-full focus-within:outline-blue-400' value={data.email} onChange={handleOnChange} />

          <label htmlFor='password'>Password</label>
          <div className='flex px-2 py-1 bg-slate-200 mt-1 mb-2 rounded-full outline-none focus-within:outline-blue-400'>
            <input type={showPassword ? "text" : "password"} id={"password"} name={"password"} className='w-full bg-slate-200 px-8 py-2 border-none outline-none' value={data.password} onChange={handleOnChange} />
            <span className='flex text-xl py-3 cursor-pointer' onClick={handleShowPassword}>{showPassword ? <BiShow /> : <BiHide />}</span> {/* icon để hiển thị hoặc ẩn mật khẩu */}
          </div>

          <p className='text-right p-2'>
            <Link to='/forgetpassword' className='text-slate-500'>
              <u>Forget Password?</u>
            </Link>
          </p>

          <div style={{ display: 'flex', justifyContent: 'center' }} className='flex py-3'>
            <button className="w-full max-w-[150px] bg-blue-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full">
              Login
            </button>
          </div>

          <p className='text-center py-2'>
            Don't have account?
            <Link to='/signup' className='font-bold text-red-500 hover:underline '>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login