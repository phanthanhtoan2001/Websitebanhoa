import { createSlice } from "@reduxjs/toolkit";

// Xác định trạng thái ban đầu cho người dùng
const initialState = {
    email: "",
    firstName: "",
    lastName: "",
    _id: "",
}

// Tạo một lát trạng thái bằng cách chỉ định tên, trạng thái ban đầu và bộ giảm tốc
export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Xác định chức năng giảm loginRedux
        loginRedux: (state, action) => {
            console.log(action.payload.data) // Ghi lại dữ liệu nhận được từ hành động

            // Cập nhật trạng thái với dữ liệu người dùng nhận được từ điểm cuối API
            state._id = action.payload.data._id
            state.firstName = action.payload.data.firstName
            state.lastName = action.payload.data.lastName
            state.email = action.payload.data.email
            state.image = action.payload.data.image
        },

        // Xác định chức năng logoutRedux reducer
        logoutRedux: (state, action) => {
            // Xóa trạng thái khi người dùng đăng xuất
            state._id = ""
            state.firstName = ""
            state.lastName = ""
            state.email = ""
            state.image = ""
        }
    }
})

// Lấy ra các action được định nghĩa trong slice
export const { loginRedux, logoutRedux } = userSlice.actions

// Export reducer của slice
export default userSlice.reducer