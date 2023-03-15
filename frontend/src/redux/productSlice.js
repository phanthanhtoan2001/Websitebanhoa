import { createSlice } from "@reduxjs/toolkit"
import { toast } from 'react-hot-toast'

// Khởi tạo state ban đầu cho productReducer
const initialState = {
    productList: [],
    cartItem: []
}

// Tạo một slice của Redux store để quản lý các reducer liên quan đến sản phẩm
export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        // Hàm action creator để lưu danh sách sản phẩm vào state
        setDataProduct: (state, action) => {
            state.productList = [...action.payload]
        },
        addCartItem: (state, action) => {
            const check = state.cartItem.some(e => e._id === action.payload._id)
            if (check) {
                toast("Already Item In Cart")
            } else {
                toast("Item Added Successfully")
                const total = action.payload.price
                state.cartItem = [...state.cartItem, { ...action.payload, quanity: 1, total: total }]
                // Lưu giỏ hàng vào localStorage
                const email = process.env.REACT_APP_LOCAL_STORAGE_KEY;
                const currentCart = JSON.parse(localStorage.getItem(email)) || [];
                if (Array.isArray(currentCart)) {
                    const newCart = [...currentCart, { ...action.payload, quanity: 1, total: total }];
                    localStorage.setItem(email, JSON.stringify(newCart));
                } else {
                    console.error("Current Cart is not an Array: ", currentCart);
                }
            }
        },
        deleteCartItem: (state, action) => {
            if (window.confirm('Bạn có muốn xóa sản phẩm này?')) {
                toast("One Item Delete");
                const index = state.cartItem.findIndex((e) => e._id === action.payload)
                state.cartItem.splice(index, 1)
                console.log(index);
                // Xóa sản phẩm khỏi giỏ hàng trong localStorage
                const email = process.env.REACT_APP_LOCAL_STORAGE_KEY;
                const currentCart = JSON.parse(localStorage.getItem(email)) || [];
                const newCart = currentCart.filter((item) => item._id !== action.payload);
                localStorage.setItem(email, JSON.stringify(newCart));
            }
        },
        increaseQuanity: (state, action) => {
            const index = state.cartItem.findIndex((el) => el._id === action.payload);
            let quanity = state.cartItem[index].quanity;
            const qtyInc = ++quanity;

            state.cartItem[index].quanity = qtyInc;

            const price = Number(state.cartItem[index].price.replace(/\./g, ''));
            const total = (price * qtyInc).toLocaleString('vi-VN', { minimumFractionDigits: 0 }).replace(',', '.')

            state.cartItem[index].total = total;

            // Cập nhật giỏ hàng trong localStorage
            const email = process.env.REACT_APP_LOCAL_STORAGE_KEY;
            const currentCart = JSON.parse(localStorage.getItem(email)) || [];
            const updatedCart = currentCart.map((item) => {
                if (item._id === action.payload) {
                    return {
                        ...item,
                        quanity: qtyInc,
                        total: total,
                    };
                }
                return item;
            });
            localStorage.setItem(email, JSON.stringify(updatedCart));
        },
        decreaseQuanity: (state, action) => {
            const index = state.cartItem.findIndex((el) => el._id === action.payload);
            let quanity = state.cartItem[index].quanity;
            if (quanity > 1) {
                const qtyDec = --quanity;
                state.cartItem[index].quanity = qtyDec;

                const price = Number(state.cartItem[index].price.replace(/\./g, ''));
                const total = (price * qtyDec).toLocaleString('vi-VN', { minimumFractionDigits: 0 }).replace(',', '.')

                state.cartItem[index].total = total;

                // Cập nhật giỏ hàng trong localStorage
                const email = process.env.REACT_APP_LOCAL_STORAGE_KEY;
                const currentCart = JSON.parse(localStorage.getItem(email)) || [];
                const updatedCart = currentCart.map((item) => {
                    if (item._id === action.payload) {
                        return {
                            ...item,
                            quanity: qtyDec,
                            total: total,
                        };
                    }
                    return item;
                });
                localStorage.setItem(email, JSON.stringify(updatedCart));
            }
        },
    }
})


// Export ra các hàm action creator để dispatch các action tương ứng với sản phẩm
export const { setDataProduct, addCartItem, deleteCartItem, increaseQuanity, decreaseQuanity } = productSlice.actions

// Export reducer đã được xử lý bơi createSlice method của Redux Toolkit
export default productSlice.reducer