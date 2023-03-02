import React, { useState } from 'react';
import loginImage from '../assets/login-user.gif';
import {BiShow, BiHide} from 'react-icons/bi'
import { Link, useNavigate } from 'react-router-dom';
import { ImagetoBase64 } from '../utility/ImagetoBase64';
import { toast } from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data,setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });
  console.log(data);
  const handleShowPassword = () => {
    setShowPassword (prev => !prev);
  };
  const handleShowConfirmPassword = () => {
    setShowConfirmPassword (prev => !prev);
  }
  const handleOnChange = (e) => {
    const {name, value} = e.target
    setData((preve) => {
      return{
        ...preve,
        [name] : value
      }
    })
  }
  const handleUploadProfileImage = async (e) => {
    const file = e.target.files[0];
    const dataUrl = await ImagetoBase64(file);
    setData((prev) => ({ 
      ...prev, 
      image: dataUrl 
    }));
  };
  
  console.log(process.env.REACT_APP_SERVER_DOMIN)
  const handleSubmit = async (e) => {
    //submit email without @
    e.preventDefault()
    //set condition for text fields
    const {firstName, email, password, confirmPassword} = data
    if(firstName && email && password && confirmPassword) {
      if(password.length >= 6 && /\d/.test(password) && /[!@#$%^&*-]/.test(password)) {
        if(password === confirmPassword) {
          const fetchData = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/signup`,{
            method: "POST",
            headers: {
              "content-type" : "application/json"
            },
            body : JSON.stringify(data)
          })
          const dataRes = await fetchData.json()
          console.log(dataRes)
          //alert(dataRes.message)
          toast(dataRes.message)
          if(dataRes.alert){
          navigate("/login");
        }
        } else {
          alert("Password and confirm password not equal")
        }
      } else {
        alert("Password must have at least 6 characters, at least one number, and at least one special character (!@#$%^&*)")
      }
    } else {
      alert("Please enter required fields")
    }    
  }

  return (
    <div className='p-5 md:p-10'>
      <div className='w-full max-w-[800px] max-w-sm bg-white m-auto flex items-center flex-col p-2'>
        <h1 className='text-center text-2x1 font-bold' style={{fontSize: '24px'}}>Sign up</h1>
        <div className='w-40 overflow-hidden rounded-full drop-shadow-md shadow-md'>
          <img src={data.image ? data.image : loginImage} className='w-full'/>

          <label htmlFor='profileImage'>
            <div className='absolute bottom-0 h-1/4 bg-slate-500 hover:bg-red-500 bg-opacity-50 w-full text-center cursor-pointer'>
              <p style={{color: 'white'}} className='text-sm p-1'>Upload</p>
            </div>
            <input type={"file"} id="profileImage" accept='image/*' className='hidden' onChange={handleUploadProfileImage}/>
          </label>
        </div>
        <form className='w-full py-3 flex flex-col' onSubmit={handleSubmit}>
          <label htmlFor='firstName'>First Name</label>
          <input type={"text"} id={"firstName"} name={"firstName"} className='mt-1 mb-2 w-full bg-slate-200 px-8 py-2 rounded-full focus-within:outline-blue-400' value={data.firstName} onChange={handleOnChange}/>

          <label htmlFor='lastName'>Last Name</label>
          <input type={"text"} id={"lastName"} name={"lastName"} className='mt-1 mb-2 w-full bg-slate-200 px-8 py-2 rounded-full focus-within:outline-blue-400' value={data.lastName} onChange={handleOnChange}/>

          <label htmlFor='email'>Email</label>
          <input type={"email"} id={"email"} name={"email"} className='mt-1 mb-2 w-full bg-slate-200 px-8 py-2 rounded-full focus-within:outline-blue-400' value={data.email} onChange={handleOnChange}/>

          <label htmlFor='password'>Password</label>
          <div className='flex px-2 py-1 bg-slate-200 mt-1 mb-2 rounded-full outline-none focus-within:outline-blue-400'>
            <input type={showPassword ? "text" : "password"} id={"password"} name={"password"} className='w-full bg-slate-200 px-8 py-2 border-none outline-none' value={data.password} onChange={handleOnChange}/>
            <span className='flex text-xl py-3 cursor-pointer' onClick={handleShowPassword}>{showPassword ? <BiShow/> : <BiHide/>}</span>
          </div>

          <label htmlFor='confirmpassword'>Confirm Password</label>
          <div className='flex px-2 py-1 bg-slate-200 mt-1 mb-2 rounded-full outline-none focus-within:outline-blue-400'>
            <input type={showConfirmPassword ? "text" : "password"} id={"confirmPassword"} name={"confirmPassword"} className='w-full bg-slate-200 px-8 py-2 border-none outline-none' value={data.confirmPassword} onChange={handleOnChange}/>
            <span className='flex text-xl py-3 cursor-pointer' onClick={handleShowConfirmPassword}>{showConfirmPassword ? <BiShow/> : <BiHide/>}</span>
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