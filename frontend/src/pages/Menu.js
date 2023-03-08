import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const Menu = () => {
  const { filterby } = useParams()
  const productData = useSelector(state => state.product.productList)

  const productDisplay = productData.filter(e => e._id === filterby)[0]
  console.log(productDisplay)

  return (
    <div className='p-2 md:p-4'>
      {productDisplay ? (
        <div className='w-full max-w-4xl bg-white m-auto md:flex justify-center'>
          <div className='max-w-sm w-full max-h-full p-5 shadow overflow-hidden'>
            <img src={productDisplay.image} className='hover:scale-110 transition-all h-full' />
          </div>
          <div className='flex flex-col gap-2'>
            <h3 className='font-bold text-slate-600 text-center capitalize text-4xl'>{productDisplay.name}</h3>
            <p className='text-center text-slate-500 font-medium capitalize text-2xl' style={{ fontStyle: 'italic' }}>{productDisplay.category}</p>
            <p className='text-center font-bold text-2xl'><span>{productDisplay.price}</span><span className='text-green-600'> VNĐ</span></p>
            <div className='flex gap-3 justify-center'>
              <button className='bg-red-400 hover:bg-blue-300 mt-4 py-1 rounded-md min-w-[100px]'>Buy</button>
              <button className='bg-yellow-400 hover:bg-green-300 mt-4 py-1 rounded-md min-w-[100px]'>Add to Cart</button>
            </div>
            <div>
              <p className='mt-5 font-medium text-2xl'>Description:</p>
              <p className='text-justify'>{productDisplay.description}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );

}

export default Menu