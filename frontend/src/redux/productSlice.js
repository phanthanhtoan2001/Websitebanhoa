import { createSlice } from "@reduxjs/toolkit"

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
            console.log(action)
            const total = action.payload.price
            state.cartItem = [...state.cartItem, {...action.payload, quanity: 1, total: total}]
        },
        deleteCartItem: (state, action) => {

        }
    }
})

// Export ra các hàm action creator để dispatch các action tương ứng với sản phẩm
export const { setDataProduct, addCartItem, deleteCartItem } = productSlice.actions

// Export reducer đã được xử lý bơi createSlice method của Redux Toolkit
export default productSlice.reducer
