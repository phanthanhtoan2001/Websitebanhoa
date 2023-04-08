import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addCartItem } from '../redux/productSlice'

const CardFeature = ({ image, name, price, category, loading, id }) => {
    const dispatch = useDispatch()
    const userEmail = useSelector(state => state.user.email)
    const adminEmail = process.env.REACT_APP_ADMIN_EMAIL

    const isAdmin = userEmail === adminEmail

    const handleAddCartProduct = (e) => {
        dispatch(addCartItem({
            _id: id,
            name: name,
            price: price,
            category: category,
            image: image
        }))
    }

    const deleteProduct = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            console.warn(id)
            let result = await fetch(
                `${process.env.REACT_APP_SERVER_DOMAIN}/product/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "content-Type": "application/json",
                    },
                    body: JSON.stringify({ _id: id }),
                }
            )
            result = await result.json()
            if (result.message === "fail") {
                toast.error(result.message)
            } else {
                toast.success("Product deleted")
                window.location.reload() // Reset trang web sau khi xóa thành công
            }
        }
    }


    return (
        <div className='w-full min-w-[230px] max-w-[230px] bg-white hover:shadow-2xl drop-shadow-lg pt-5 px-4 cursor-pointer flex flex-col' style={{ borderRadius: '20px' }}>
            {
                image ? <>
                    <Link to={`/menu/${id}`} onClick={() => window.scrollTo({ top: "0", behavior: "smooth`" })}>
                        <div className="h-40 w-full flex flex-col overflow-hidden" style={{ justifyContent: "center", alignItems: "center" }}>
                            <img src={image} className="h-full object-cover w-full" />
                        </div>

                        <div className='flex-grown'>
                            <h3 className='font-semibold text-slate-600 capitalize text-lg mt-4 text-center' style={{ height: '5em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2 }}>{name}</h3>
                        </div>

                        <div className='mt-1 flex flex-col'>
                            <p className='text-slate-500 font-medium capitalize' style={{ fontStyle: 'italic' }}>{category}</p>
                            <p className='font-bold'><span>{price}</span><span className='text-green-600'> VNĐ</span></p>
                        </div>
                    </Link>

                    <div className='w-full flex flex-col justify-end items-center mt-2'>
                        <button className='bg-yellow-400 hover:bg-green-300 mb-3 mt-1 py-1 rounded-md w-full' onClick={handleAddCartProduct}>Add to Cart</button>
                        {/* Đảm bảo rằng isAdmin được kiểm tra */}
                        {isAdmin &&
                            <>
                                <div className='flex justify-between w-full gap-2'>
                                    <Link to={`/updateproduct/${id}`} className='whitespace-nowrap cursor-pointer text-center bg-blue-300 hover:bg-green-300 mb-3 mt-1 py-1 rounded-md w-full'>Update product</Link>
                                    <button onClick={() => deleteProduct(id)} className='whitespace-nowrap cursor-pointer text-center bg-blue-300 hover:bg-red-500 mb-3 mt-1 py-1 rounded-md w-full'>Delete</button>
                                </div>
                            </>
                        }
                    </div>

                </> : <div className='min-h-[300px] flex justify-center items-center'>
                    <p>{loading = "Loading..."}</p>
                </div>
            }
        </div>

    )
}

export default CardFeature
