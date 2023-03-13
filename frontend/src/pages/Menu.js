import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import AllProduct from '../components/AllProduct'
import { addCartItem } from '../redux/productSlice'

const Menu = () => {
  // Lấy giá trị filterby từ useParams() để lọc sản phẩm được chọn
  const { filterby } = useParams()

  const dispatch = useDispatch()

  // Lấy danh sách sản phẩm từ Redux store bằng useSelector()
  const productData = useSelector(state => state.product.productList)

  // Lọc ra sản phẩm có _id trùng với filterby và lưu vào productDisplay, 
  // filter trả về 1 mảng nên chúng ta lấy phần tử đầu tiên [0]
  const productDisplay = productData.filter(e => e._id === filterby)[0]

  const handleAddCartProduct = (e) => {
    dispatch(addCartItem(productDisplay))
  }

  console.clear()

  return (
    <div className='p-2 md:p-4'>
      <div className='w-full max-w-4xl bg-white m-auto md:flex justify-center'>
        <div className='max-w-sm w-full max-h-full p-5 shadow overflow-hidden'>
          <img src={productDisplay?.image} className={`hover:scale-110 transition-all h-full ${productDisplay && 'cursor-pointer'}`} />
        </div>
        {productDisplay &&
          <div className='flex flex-col gap-2'>
            <h3 className='font-bold text-slate-600 text-center capitalize text-4xl'>{productDisplay.name}</h3>
            <p className='text-center text-slate-500 font-medium capitalize text-2xl' style={{ fontStyle: 'italic' }}>{productDisplay.category}</p>
            <p className='text-center font-bold text-2xl'><span>{productDisplay.price}</span><span className='text-green-600'> VNĐ</span></p>
            <div className='flex gap-3 justify-center'>
              <Link to={{ pathname: '/cart', search: `?add=${productDisplay._id}`, }}
                className='bg-yellow-400 hover:bg-green-300 mt-4 py-1 rounded-md min-w-[100px] text-center' onClick={handleAddCartProduct}>
                Buy
              </Link>
              <button className='bg-yellow-400 hover:bg-green-300 mt-4 py-1 rounded-md min-w-[100px]' onClick={handleAddCartProduct}>Add to Cart</button>
            </div>
            <div className='px-2'>
              <p className='mt-5 font-medium text-2xl'>Description:</p>
              <p className='text-justify'>{productDisplay.description}</p>
            </div>
          </div>
        }
      </div>
      <AllProduct heading={"Other Product"} />
    </div>
  )

}

export default Menu