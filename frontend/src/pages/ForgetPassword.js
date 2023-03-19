import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import loginImage from '../assets/login-user.gif'

const ForgetPassword = () => {
    const [email, setEmail] = useState()
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email
                })
            })
            if (response.ok) {
                navigate(`/resetpassword/${email}`)
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <section>
            <div className='p-5 md:p-10'>
                <div className='w-full max-w-[800px] max-w-sm bg-white m-auto flex items-center flex-col p-2'>
                    <h1 className='text-center text-2xl font-bold' style={{ fontSize: '24px' }}>Forget Password</h1>
                    <div className='w-40 overflow-hidden rounded-full drop-shadow-md shadow-md'>
                        <img src={loginImage} className='w-full' />
                    </div>
                    <form className='w-full py-3 flex flex-col' onSubmit={handleSubmit}>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            className='mt-1 mb-2 w-full bg-slate-200 px-8 py-2 rounded-full focus-within:outline-blue-400' />

                        <div style={{ display: 'flex', justifyContent: 'center' }} className='flex py-3'>
                            <button type='submit' className="w-full max-w-[150px] bg-blue-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-full">
                                Send
                            </button>
                        </div>

                        <p className='text-center py-2'>
                            Remember password?
                            <Link to='/login' className='font-bold text-red-500 hover:underline '>
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    )

}

export default ForgetPassword
