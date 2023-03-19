import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CartProduct from '../components/CartProduct';
import emptyCart from '../assets/empty-cart.gif';
import { setDataProduct } from '../redux/productSlice';

const Cart = () => {
    const productCartItem = useSelector((state) => state.product.cartItem) // Lấy cart item từ redux store
    const totalPrice = productCartItem.reduce(
        (acc, curr) =>
            parseFloat(acc.toString().replace(/\./g, '').replace(',', '.')) +
            parseFloat(curr.total.replace(/\./g, '').replace(',', '.')),
        0
    )
    const totalQuantity = productCartItem.reduce((acc, curr) => acc + parseInt(curr.quanity), 0)

    const dispatch = useDispatch()

    // Sử dụng hook useEffect để lấy dữ liệu từ local storage
    useEffect(() => {
        // Lấy email của user từ biến môi trường
        const email = process.env.REACT_APP_LOCAL_STORAGE_KEY
        // Lấy cart data từ local storage, nếu không có sẽ trả về một mảng rỗng
        const currentCart = JSON.parse(localStorage.getItem(email)) || []

        // Nếu cart data lấy từ local storage không rỗng, gửi action để cập nhật cart trong redux store
        if (currentCart.length > 0) {
            console.log('Current cart:', currentCart)
            dispatch(setDataProduct(currentCart)) // Truyền cart data như một đối số vào action
        }
    }, [dispatch])

    // Sử dụng hook useEffect để lưu dữ liệu vào local storage khi cart data trong redux store thay đổi
    useEffect(() => {
        const email = process.env.REACT_APP_LOCAL_STORAGE_KEY
        localStorage.setItem(email, JSON.stringify(productCartItem)) // Lưu cart data thành chuỗi JSON vào local storage
    }, [productCartItem])


    return (
        <>
            <div className='p-2 md:p-4'>
                <h2 className='text-lg md:text-4xl font-bold text-slate-600'>Your Cart Items</h2>
                {productCartItem[0] ?
                    <div className='my-5 mx-5 flex gap-4'>
                        {/*display cart items*/}
                        <div className='w-full max-w-5xl' style={{ width: '2800px' }}>
                            {
                                productCartItem.map(e => {
                                    return (
                                        <CartProduct
                                            key={e._id}
                                            id={e._id}
                                            name={e.name}
                                            image={e.image}
                                            category={e.category}
                                            quanity={e.quanity}
                                            total={e.total}
                                            price={e.price}
                                        />
                                    )
                                })
                            }
                        </div>

                        {/*total cart item*/}
                        <div className='w-96 p-4 bg-green-200 rounded-lg shadow-xl ml-auto mx-auto flex flex-col' style={{ height: '400px' }}>
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
                            <button className='w-full text-2xl font-bold py-2 text-white bg-red-400 mt-auto'>Payment</button>
                        </div>
                    </div> : <>
                        <div className='flex flex-col w-full justify-center items-center'>
                            <img src={emptyCart} className='w-full max-w-sm' />
                            <p className='text-slate-500 text-3xl font-bold'>Empty Cart</p>
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default Cart