import React from 'react'

const InfoProductCart = ({ name, quanity, total }) => {
  return (
    <div className='bg-slate-200 p-2 flex justify-between gap-5 rounded-md border-2 border-slate-400'>
      <div className='flex flex-col gap-2 w-full'>
        <div className='flex justify-between'>
          <h3 className='font-bold text-slate-600 capitalize text-3xl'>{name}</h3>
        </div>
        <div className="flex justify-between mt-3 items-center">
          <div className='flex gap-3 items-center'>
            <p className='font-semibold p-2 text-xl mt-3'>Quantity: {quanity}</p>
          </div>
          <div className='mt-2 font-bold'>
            <p className='text-xl italic text-gray-500'>Total</p>
            <p className='text-lg'>{total}<span className='text-green-600'> VNĐ</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InfoProductCart