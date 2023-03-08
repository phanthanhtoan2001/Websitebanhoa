import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRedux } from '../redux/userSlice';
import { toast } from 'react-hot-toast';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false)  // State Hook được sử dụng để giữ thông tin về trạng thái của menu hiển thị hoặc ẩn

  const userData = useSelector((state) => state.user)  // Sử dụng hooks useSelector từ Redux để lắng nghe và cập nhật thông tin người dùng 
  console.log(userData.email) // In ra email của người dùng từ store userData

  const dispatch = useDispatch() // Sử dụng hooks useDispatch từ Redux để gọi các action của reducer, để tương tác với store trong React 

  const handleShowMenu = () => {
    setShowMenu(prev => !prev) // Hàm xử lý khi người dùng click vào icon user để mở/đóng menu
  }

  const handleLogout = () => {
    dispatch(logoutRedux())  // Đăng xuất user, gọi function logoutRedux từ trong rootReducer sử dụng useSelector và useDispatch hooks đã import
    toast("Logout successfully")
  }

  console.log(process.env.REACT_APP_ADMIN_EMAIL) // Log ra email của admin từ biến môi trường REACT_APP_ADMIN_EMAIL 

  return (
    <header className='fixed shadow-md w-full h-32 px-2 md:px-4 z-50 bg-white' style={{ borderBottom: '2px solid #ccc' }}>
      <div className='flex items-center h-full justify-between'>
        <Link to={''}>
          <div className="h-18">
            <img src={logo} className="h-full" />
          </div>
        </Link>
        <div className='flex items-center gap-4 md:gap-7 hidden md:flex'>
          <Link to={'/'} className='mx-4 text-gray-600 hover:text-red-500 my-2 md:my-0' style={{ fontSize: '1.6rem' }}>
            Home
          </Link>
          <Link to={'/menu/64044b0f441f315547c69a7c'} className='mx-4 text-gray-600 hover:text-red-500 my-2 md:my-0' style={{ fontSize: '1.6rem' }}>
            Menu
          </Link>
          <Link to={'/about'} className='mx-4 text-gray-600 hover:text-red-500 my-2 md:my-0' style={{ fontSize: '1.6rem' }}>
            About
          </Link>
          <Link to={'/contact'} className='mx-4 text-gray-600 hover:text-red-500 my-2 md:my-0' style={{ fontSize: '1.6rem' }}>
            Contact
          </Link>
          <div className='text-2x1 text-slate-600 relative'>
            <Link to={'/cart'} className='ml-10 mx-4 text-gray-600 hover:text-red-500'>
              <FaShoppingCart size={30} />
              < div className='absolute left-5 top-5 text-white bg-red-500 h-5 w-5 rounded-full m-0 text-sm text-center'>0</div>
            </Link>
          </div>

          <div className='text-slate-600' onClick={handleShowMenu}>
            <div className='text-3x1 cursor-pointer w-10 h-10 rounded-full overflow-hidden drop-shadow-md'>
              {
                userData.image ? <img src={userData.image} className='h-full w-full' /> :
                  <div className='text-gray-600 hover:text-red-500'>
                    <HiOutlineUserCircle size={38} />
                  </div>
              }
            </div>
            {/* Nếu showMenu == true, render dropdown menu */}
            {showMenu && (
              <div className='absolute top-23 right-4 bg-white py-1 px-3 shadow drop-shadow-md flex flex-col'>
                {
                  //Hiện thị link 'New product' cho người dùng với email là email của admin
                  userData.email === process.env.REACT_APP_ADMIN_EMAIL && <Link to={'/newproduct'} className='whitespace-nowrap cursor-pointer text-black'>New product</Link>
                }
                {
                  userData.image ? (<p className='flex items-center justify-center cursor-pointer text-white px-3 bg-red-300' onClick={handleLogout}>Logout ({userData.firstName})</p>) : (<Link to={'/login'} className='whitespace-nowrap cursor-pointer text-black'>Login</Link>)
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
