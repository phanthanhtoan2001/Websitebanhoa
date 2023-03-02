import React, { useState } from 'react';
import loginImage from '../assets/login-user.gif';
import {BiShow, BiHide} from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [data,setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  console.log(data);
  const handleShowPassword = () => {
    setShowPassword (prev => !prev);
  };
  const handleOnChange = (e) => {
    const {name, value} = e.target
    setData((preve) => {
      return{
        ...preve,
        [name] : value
      }
    })
  }
  const handleSubmit = (e) => {
    //submit email without @
    e.preventDefault()
    //set condition for text fields
    const {email, password} = data
    if(email && password) {
      alert('Successfull')
      navigate("/login")
    } else {
      alert('Please enter required fields')
    }
  }

  return (
    <div className='p-5 md:p-10'>
      <div className='w-full max-w-[800px] max-w-sm bg-white m-auto flex items-center flex-col p-2'>
        <h1 className='text-center text-2x1 font-bold' style={{fontSize: '24px'}}>Sign up</h1>
        <div className='w-40 overflow-hidden rounded-full drop-shadow-md shadow-md'>
          <img src={loginImage} className='w-full'/>
        </div>
        <form className='w-full py-3 flex flex-col' onSubmit={handleSubmit}>
          <label htmlFor='email'>Email</label>
          <input type={"email"} id={"email"} name={"email"} className='mt-1 mb-2 w-full bg-slate-200 px-8 py-2 rounded-full focus-within:outline-blue-400' value={data.email} onChange={handleOnChange}/>

          <label htmlFor='password'>Password</label>
          <div className='flex px-2 py-1 bg-slate-200 mt-1 mb-2 rounded-full outline-none focus-within:outline-blue-400'>
            <input type={showPassword ? "text" : "password"} id={"password"} name={"password"} className='w-full bg-slate-200 px-8 py-2 border-none outline-none' value={data.password} onChange={handleOnChange}/>
            <span className='flex text-xl py-3 cursor-pointer' onClick={handleShowPassword}>{showPassword ? <BiShow/> : <BiHide/>}</span>
          </div>

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