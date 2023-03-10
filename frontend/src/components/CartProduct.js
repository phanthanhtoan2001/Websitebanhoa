import React from 'react'

const CartProduct = ({id, name, image, category, quanity, total, price}) => {
  return (
    <div className='bg-slate-200 p-2 flex'>
        <div className='bg-white p-3'>
            <img src={image} className='h-40 w-48 object-cover'/>
        </div>
    </div>
  )
}

export default CartProduct