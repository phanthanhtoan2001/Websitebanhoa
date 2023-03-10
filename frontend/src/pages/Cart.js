import React from 'react';
import { useSelector } from 'react-redux';
import CartProduct from '../components/CartProduct';

const Cart = () => {
    const productCartItem = useSelector((state) => state.product.cartItem)
    console.log(productCartItem)

    return (
        <div className='p-2 md:p-4'>
            <h2 className='text-lg md:text-2xl font-bold text-slate-600'>Your Cart Items</h2>

            <div className=''>
                {/*display cart items*/}
                <div className=''>
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
                <div className=''></div>
            </div>
        </div>
    )
}

export default Cart
