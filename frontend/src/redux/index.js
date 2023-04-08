import { configureStore } from '@reduxjs/toolkit'
import productSliceReducer from './productSlice'
import userSliceReducer from './userSlice'
import cmtSlice from './cmtSlice'

// Tạo store redux với 2 reducer - user và product
export const store = configureStore({
    reducer: {
        user: userSliceReducer, // Đối tượng user
        product: productSliceReducer, // Đối tượng sản phẩm
        comments: cmtSlice // Đối tượng bình luận 
    },
})
