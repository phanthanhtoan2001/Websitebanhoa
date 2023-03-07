import React from 'react'

const HomeCard = ({ name, image, price, category, loading }) => {
    return (
        <div className='p-2 ml-6 mr-6 shadow-md rounded-md min-w-[180px]' style={{ background: '#BFEFFF', display: 'block', justifyContent: 'center' }}>
            {
                name ? (
                    <>
                        <div className='w-44 h-44 min-h-[180px] justify-center items-center'>
                            <img src={image} className='w-full h-full' />
                        </div>

                        <h3 className='font-semibold text-slate-600 text-center capitalize w-44'>{name}</h3>
                        <p className='text-center text-slate-500 font-medium capitalize' style={{ fontStyle: 'italic' }}>{category}</p>
                        <p className='text-center font-bold'><span>{price}</span><span className='text-green-600'> VNĐ</span></p>
                    </>
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <p>{loading}</p>
                    </div>
                )
            }
        </div>
    )
}

export default HomeCard