import React, { useState } from 'react';
import loginImage from '../assets/login-user.gif';
import { BiShow, BiHide } from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom';
import { ImagetoBase64 } from '../utility/ImagetoBase64';
import { toast } from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false); //state để hiển thị hoặc ẩn password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); //state để hiển thị hoặc ẩn confirmPassword

  const [data, setData] = useState({ //state chứa các thông tin nhập vào từ form
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });

  console.log(data); //In ra để kiểm tra xem dữ liệu được cập nhật trong state data hay không?

  const handleShowPassword = () => { //Hàm để hiển thị hoặc ẩn password
    setShowPassword(prev => !prev);
  };

  const handleShowConfirmPassword = () => { //Hàm để hiển thị hoặc ẩn confirmPassword
    setShowConfirmPassword(prev => !prev);
  }

  const handleOnChange = (e) => { //Hàm để lấy giá trị từ các input và cập nhật vào state data
    const { name, value } = e.target
    setData((preve) => {
      return {
        ...preve,
        [name]: value
      }
    })
  }

  const handleUploadProfileImage = async (e) => { //Hàm để lấy đường dẫn ảnh upload lên từ máy tính và cập nhật vào state data
    const file = e.target.files[0];
    const dataUrl = await ImagetoBase64(file);
    setData((prev) => ({
      ...prev,
      image: dataUrl
    }));
  };

  console.log(process.env.REACT_APP_SERVER_DOMIN) //In ra biến môi trường REACT_APP_SERVER_DOMAIN để kiểm tra xem có chính xác không?

  const handleSubmit = async (e) => { //Hàm xử lý submit form khi người dùng click nút Sign up
    e.preventDefault() //Ngăn chặn hành động submit mặc định của trình duyệt
    //Set condition cho các trường nhập liệu bắt buộc
    const { firstName, email, password, confirmPassword } = data
    if (firstName && email && password && confirmPassword) { //Kiểm tra xem các input có rỗng hay không?
      if (password.length >= 6 && /\d/.test(password) && /[!@#$%^&*-]/.test(password)) { //Kiểm tra độ dài và cấu trúc của password
        if (password === confirmPassword) { //Kiểm tra xem password và confirmPassword có giống nhau hay không?
          const fetchData = fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/signup`, { //Gọi API POST tới server để đăng ký tài khoản mới
            method: "POST",
            headers: {
              "content-type": "application/json"
            },
            body: JSON.stringify(data)
          })
          const dataRes = await fetchData.json() //Lấy kết quả trả về từ server dạng json
          console.log(dataRes) //Kiểm tra kết quả trả về từ server
          toast(dataRes.message) //Hiển thị thông báo thành công hoặc lỗi bằng thư viện react-hot-toast
          if (dataRes.alert) { //Nếu đăng ký thành công thì redirect sang trang đăng nhập
            navigate("/login");
          }
        } else {
          alert("Password and confirm password not equal") //Thông báo password và confirmPassword không giống nhau
        }
      } else {
        alert("Password must have at least 6 characters, at least one number, and at least one special character (!@#$%^&*)") //Thông báo điều kiện password không đúng
      }
    } else {
      alert("Please enter required fields") //Thông báo yêu cầu nhập đầy đủ các trường bắt buộc
    }
  }

  return (
    <div className='p-5 md:p-10'>
      <div className='w-full max-w-[800px] max-w-sm bg-white m-auto flex items-center flex-col p-2'>
        <h1 className='text-center text-2x1 font-bold' style={{ fontSize: '24px' }}>Sign up</h1>
        <div className='w-40 overflow-hidden rounded-full drop-shadow-md shadow-md'>
          <img src={data.image ? data.image : loginImage} className='w-full' />

          <label htmlFor='profileImage'>
            <div className='absolute bottom-0 h-1/4 bg-slate-500 hover:bg-red-500 bg-opacity-50 w-full text-center cursor-pointer'>
              <p style={{ color: 'white' }} className='text-sm p-1'>Upload</p>
            </div>
            <input type={"file"} id="profileImage" accept='image/*' className='hidden' onChange={handleUploadProfileImage} />
          </label>
        </div>
        <form className='w-full py-3 flex flex-col' onSubmit={handleSubmit}>
          <label htmlFor='firstName'>First Name</label>
          <input type={"text"} id={"firstName"} name={"firstName"} className='mt-1 mb-2 w-full bg-slate-200 px-8 py-2 rounded-full focus-within:outline-blue-400' value={data.firstName} onChange={handleOnChange} />

          <label htmlFor='lastName'>Last Name</label>
          <input type={"text"} id={"lastName"} name={"lastName"} className='mt-1 mb-2 w-full bg-slate-200 px-8 py-2 rounded-full focus-within:outline-blue-400' value={data.lastName} onChange={handleOnChange} />

          <label htmlFor='email'>Email</label>
          <input type={"email"} id={"email"} name={"email"} className='mt-1 mb-2 w-full bg-slate-200 px-8 py-2 rounded-full focus-within:outline-blue-400' value={data.email} onChange={handleOnChange} />

          <label htmlFor='password'>Password</label>
          <div className='flex px-2 py-1 bg-slate-200 mt-1 mb-2 rounded-full outline-none focus-within:outline-blue-400'>
            <input type={showPassword ? "text" : "password"} id={"password"} name={"password"} className='w-full bg-slate-200 px-8 py-2 border-none outline-none' value={data.password} onChange={handleOnChange} />
            <span className='flex text-xl py-3 cursor-pointer' onClick={handleShowPassword}>{showPassword ? <BiShow /> : <BiHide />}</span>
          </div>

          <label htmlFor='confirmpassword'>Confirm Password</label>
          <div className='flex px-2 py-1 bg-slate-200 mt-1 mb-2 rounded-full outline-none focus-within:outline-blue-400'>
            <input type={showConfirmPassword ? "text" : "password"} id={"confirmPassword"} name={"confirmPassword"} className='w-full bg-slate-200 px-8 py-2 border-none outline-none' value={data.confirmPassword} onChange={handleOnChange} />
            <span className='flex text-xl py-3 cursor-pointer' onClick={handleShowConfirmPassword}>{showConfirmPassword ? <BiShow /> : <BiHide />}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }} className='flex py-3'>
            <button className="w-full max-w-[150px] bg-blue-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full">
              Sign up
            </button>
          </div>

          <p className='text-center py-2'>
            Already have an account?
            <Link to='/login' className='font-bold text-red-500 hover:underline'>
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup