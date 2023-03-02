import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import logo from '../assets/logo.png';
import {HiOutlineUserCircle} from 'react-icons/hi';
import {FaShoppingCart} from 'react-icons/fa';

const Header = () => {
  const[showMenu,setShowMenu] = useState(false)
  const handleShowMenu = () => {
    setShowMenu(preve => !preve)
  }
  return (  
    <header className='fixed shadow-md w-full h-32 px-2 md:px-4 z-50 bg-white' style={{ borderBottom: '2px solid #ccc' }}>
      <div className='flex items-center h-full justify-between'>
        <Link to={''}>
          <div className="h-18">
            <img src={logo} className="h-full"/>
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
            <div className='text-3x1 cursor-pointer'>
              <div className='mx-4 text-gray-600 hover:text-red-500'>
                <HiOutlineUserCircle size={38} />
              </div>
            </div>
            {showMenu && (
              <div className='absolute top-23 right-4 bg-white py-1 px-2 shadow drop-shadow-md'>
                <div>
                  <Link to={'/newproduct'} className='whitespace-nowrap cursor-pointer text-black'>New product</Link>
                </div>
                <div>
                  <Link to={'/login'} className='whitespace-nowrap cursor-pointer text-black'>Login</Link>
                </div>
              </div>
            )}
          </div> 
        </div>
      </div>
    </header>
  );
};

export default Header;
