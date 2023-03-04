import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { FaShoppingCart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { logoutRedux } from '../redux/userSlice';
import { toast } from 'react-hot-toast';

const Header = () => {
  const [showMenu, setShowMenu] = useState(false)

  const userData = useSelector((state) => state.user)
  console.log(userData)

  const dispatch = useDispatch()

  const handleShowMenu = () => {
    setShowMenu(preve => !preve)
    toast("Logout successfully")
  }

  const handleLogout = () => {
    dispatch(logoutRedux())
  }

  return (
    <header className='fixed shadow-md w-full h-32 px-2 md:px-4 z-50 bg-white' style={{ borderBottom: '2px solid #ccc' }}>
      <div className='flex items-center h-full justify-between'>
        <Link to={''}>
          <div className="h-18">
            <img src={logo} className="h-full" />
          </div>
        </Link>
        <div className='flex items-center gap-4 md:gap-7'>
          <Link to={'/'} className='mx-4 text-gray-600 hover:text-red-500 my-2 md:my-0' style={{ fontSize: '1.6rem' }}>
            Home
          </Link>
          <Link to={'/menu'} className='mx-4 text-gray-600 hover:text-red-500 my-2 md:my-0' style={{ fontSize: '1.6rem' }}>
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
            {showMenu && (
              <div className='absolute top-23 right-4 bg-white py-1 px-3 shadow drop-shadow-md flex flex-col'>
                <Link to={'/newproduct'} className='whitespace-nowrap cursor-pointer text-black'>New product</Link>
                {
                  userData.image ? <p className='flex items-center justify-center cursor-pointer text-white px-3 bg-red-300' onClick={handleLogout}>Logout</p> : <Link to={'/login'} className='whitespace-nowrap cursor-pointer text-black'>Login</Link>
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
