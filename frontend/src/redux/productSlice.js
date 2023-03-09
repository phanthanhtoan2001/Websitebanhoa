import { createSlice } from "@reduxjs/toolkit"

// Khởi tạo state ban đầu cho productReducer
const initialState = {
    productList: []
}

// Tạo một slice của Redux store để quản lý các reducer liên quan đến sản phẩm
export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        // Action creator để set data cho danh sách sản phẩm
        setDataProduct: (state, action) => {
            // Action có dạng {type: "product/setDataProduct", payload: [data]}
            console.log(action)
            state.productList = [...action.payload]
        }
    }
})

// Export ra các hàm action creator để dispatch các action tương ứng với sản phẩm
export const { setDataProduct } = productSlice.actions

// Export reducer đã được xử lý bơi createSlice method của Redux Toolkit
export default productSlice.reducer
