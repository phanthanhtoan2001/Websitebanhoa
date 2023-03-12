import React from 'react'
import { BiPlusMedical } from 'react-icons/bi'
import { TiMinus } from 'react-icons/ti'
import { AiTwotoneDelete } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { deleteCartItem, increaseQuanity, decreaseQuanity } from '../redux/productSlice'

const CartProduct = ({ id, name, image, category, quanity, total, price }) => {
  const dispacth = useDispatch()

  return (
    <div class='bg-slate-200 p-2 flex justify-between gap-5 rounded-md border-2 border-slate-400'>
      <div class='bg-white p-3 rounded overflow-hidden'>
        <img src={image} class='h-40 w-48 object-cover' />
      </div>
      <div class='flex flex-col gap-2 w-full'>
        <div className='flex justify-between'>
          <h3 class='font-bold text-slate-600 capitalize text-3xl'>{name}</h3>
          <div className='cursor-pointer hover:text-red-500'>
            <AiTwotoneDelete size={30} onClick={() => dispacth(deleteCartItem(id))} />
          </div>
        </div>
        <p class='text-slate-500 font-medium capitalize text-2xl' style={{ fontStyle: 'italic' }}>{category}</p>
        <p class='font-bold text-2xl'><span>{price}</span><span class='text-green-600'> VNĐ</span></p>
        <div className="flex justify-between mt-3 items-center">
          <div class='flex gap-3 items-center'>
            <button class='bg-gray-400 hover:bg-slate-500 mt-4 py-1 rounded-full p-2 w-8 h-8' onClick={() => dispacth(increaseQuanity(id))}><BiPlusMedical /></button>
            <p class='font-semibold p-2 text-xl mt-3'>{quanity}</p>
            <button class='bg-gray-400 hover:bg-slate-500 mt-4 py-1 rounded-full p-2 w-8 h-8' onClick={() => dispacth(decreaseQuanity(id))}><TiMinus /></button>
          </div>
          <div className='mt-2 font-bold'>
            <p class='text-xl italic text-gray-500'>Total</p>
            <p class='text-lg'>{total}<span className='text-green-600'> VNĐ</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartProduct