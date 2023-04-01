import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import InfoProductCart from '../components/InfoProductCart'

const Payment = () => {
    const productCartItem = useSelector((state) => state.product.cartItem) // Lấy cart item từ redux store
    const totalPrice = productCartItem.reduce(
        (acc, curr) => acc + parseFloat(curr.total.replace(/\./g, '').replace(',', '.')),
        0
    ).toLocaleString('vi', { style: 'decimal', minimumFractionDigits: 0 })
    
    const totalQuantity = productCartItem.reduce((acc, curr) => acc + parseInt(curr.quanity), 0)

    return (
        <div className='flex justify-between mt-2'>
            <div className='p-4 bg-green-200 rounded-lg shadow-xl ml-auto mx-auto flex flex-col' style={{ width: '50%', height: 'auto' }}>
                <h2 className='text-3xl font-bold text-blue-600 p-3 border-b-2 border-blue-200'>Payment Information</h2>
                <form className='flex flex-col flex-grow-1 w-full p-4'>
                    <label className='text-base font-medium text-gray-700 mb-2' htmlFor='fullname'>Fullname</label>
                    <input className='border-gray-300 border-2 rounded-md p-2 mb-4' type='text' id='fullname' name='fullname' required />
                    <label className='text-base font-medium text-gray-700 mb-2' htmlFor='email'>Email</label>
                    <input className='border-gray-300 border-2 rounded-md p-2 mb-4' type='email' id='email' name='email' defaultValue='user@example.com' readOnly required />
                    <label className='text-base font-medium text-gray-700 mb-2' htmlFor='address'>Address</label>
                    <input className='border-gray-300 border-2 rounded-md p-2 mb-4' id='address' name='address' rows='3' required></input>
                    <label className='text-base font-medium text-gray-700 mb-2' htmlFor='phone'>Phone number</label>
                    <input className='border-gray-300 border-2 rounded-md p-2 mb-4' type='tel' id='phone' name='phone' required />
                    <label className='text-base font-medium text-gray-700 mb-2' htmlFor='delivery'>Delivery date</label>
                    <input className='border-gray-300 border-2 rounded-md p-2 mb-4' type='date' id='delivery' name='delivery' required />
                    <label className='text-base font-medium text-gray-700 mb-2' htmlFor='message'>Notice</label>
                    <textarea className='border-gray-300 border-2 rounded-md p-2 mb-4' id='message' name='message' rows='3'></textarea>
                    <label className='text-base font-medium text-gray-700 mb-2' htmlFor='paymentMethod'>Payment methods</label>
                    <select className='border-gray-300 border-2 rounded-md p-2 mb-4' id='paymentMethod' name='paymentMethod' required>
                        <option value='creditcard'>Bank transfer</option>
                        <option value='paypal'>Momo</option>
                    </select>
                </form>
                <div className='w-full text-2xl font-bold py-2 text-white bg-red-400 mt-auto text-center'>
                    <Link to="/payment">
                        <button>Payment</button>
                    </Link>
                </div>
            </div>
            <div className='mr-12'>
                <div className='mb-5'>
                    {
                        productCartItem.map(e => {
                            return (
                                <InfoProductCart
                                    name={e.name}
                                    category={e.category}
                                    quanity={e.quanity}
                                    total={e.total}
                                />
                            )
                        })
                    }
                </div>
                <div className='w-96 p-4 bg-green-200 rounded-lg shadow-xl ml-auto mx-auto flex flex-col' style={{ height: 'auto' }}>
                    <h2 className='text-3xl font-bold text-blue-600 p-3 border-b-2 border-blue-200'>Order Summary</h2>
                    <div className='flex flex-col flex-grow-1 w-full p-4'>
                        <div className='flex items-center mb-2'>
                            <p className='text-base font-medium text-gray-700'>Total Quantity:</p>
                            <p className='ml-auto text-lg font-semibold text-gray-900'>{totalQuantity}</p>
                        </div>
                        <div className='flex items-center'>
                            <p className='text-base font-medium text-gray-700'>Total Price:</p>
                            <p className='ml-auto text-lg font-semibold text-green-800'>{totalPrice}<span className='text-green-600'> VNĐ</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment