import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { addCartItem } from '../redux/productSlice'

const CardFeature = ({ image, name, price, category, loading, id }) => {
    const dispatch = useDispatch()
    const handleAddCartProduct = (e) => {
        dispatch(addCartItem({
            _id: id,
            name: name,
            price: price,
            category: category,
            image: image
        }))
    }

    return (
        <div className='w-full min-w-[230px] max-w-[230px] bg-white hover:shadow-2xl drop-shadow-lg pt-5 px-4 cursor-pointer flex flex-col' style={{ borderRadius: '20px' }}>
            {
                image ? <>
                    <Link to={`/menu/${id}`} onClick={() => window.scrollTo({ top: "0", behavior: "smooth`" })}>
                        <div className="h-40 w-full flex flex-col overflow-hidden" style={{ justifyContent: "center", alignItems: "center" }}>
                            <img src={image} className="h-full object-cover w-full" />
                        </div>

                        <div className='flex-grow'>
                            <h3 className='font-semibold text-slate-600 capitalize text-lg mt-4 text-center' style={{ height: '5em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2 }}>{name}</h3>
                        </div>

                        <div className='mt-1 flex flex-col'>
                            <p className='text-slate-500 font-medium capitalize' style={{ fontStyle: 'italic' }}>{category}</p>
                            <p className='font-bold'><span>{price}</span><span className='text-green-600'> VNĐ</span></p>
                        </div>
                    </Link>

                    <div className='mt-2 w-full flex justify-end items-center'>
                        <button className='bg-yellow-400 hover:bg-green-300 mb-3 mt-1 py-1 rounded-md w-full' onClick={handleAddCartProduct}>Add to Cart</button>
                    </div>
                </> : <div className='min-h-[300px] flex justify-center items-center'>
                    <p>{loading}</p>
                </div>
            }
        </div>

    )
}

export default CardFeature
