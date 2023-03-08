import React from 'react'

const CardFeature = ({ image, name, price, category, loading }) => {
    return (
        <div className='w-full min-w-[230px] max-w-[230px] bg-white hover:shadow-2xl drop-shadow-lg pt-5 px-4 cursor-pointer flex flex-col' style={{ borderRadius: '20px' }}>
            {
                image ? <>
                    <div className="h-40 w-full flex flex-col overflow-hidden" style={{ justifyContent: "center", alignItems: "center" }}>
                        <img src={image} className="h-full object-cover w-full" />
                    </div>

                    <div className='flex-grow'>
                        <h3 className='font-semibold text-slate-600 capitalize text-lg mt-4 text-center'>{name}</h3>
                    </div>

                    <div className='mt-1 flex flex-col'>
                        <p className='text-slate-500 font-medium capitalize' style={{ fontStyle: 'italic' }}>{category}</p>
                        <p className='font-bold'><span>{price}</span><span className='text-green-600'> VNĐ</span></p>
                    </div>

                    <div className='mt-2 flex flex-col w-48'>
                        <button className='bg-yellow-400 hover:bg-green-300 mb-3 mt-1 py-1 rounded-md'>Add to Cart</button>
                    </div>
                </> : <div className='min-h-[300px] flex justify-center items-center'>
                    <p>{loading}</p>
                </div>
            }
        </div>

    )
}

export default CardFeature