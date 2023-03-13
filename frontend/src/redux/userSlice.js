import { createSlice } from "@reduxjs/toolkit";

const LOCAL_STORAGE_KEY = process.env.REACT_APP_LOCAL_STORAGE_KEY;

// Xác định trạng thái ban đầu cho người dùng
let initialState = {
    email: "",
    firstName: "",
    lastName: "",
    _id: "",
}

// Lấy dữ liệu từ LocalStorage nếu đã lưu trước đó
if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
    initialState = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
}

// Tạo một slice trạng thái bằng cách chỉ định tên, trạng thái ban đầu và bộ giảm tốc
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

            // Lưu thông tin đăng nhập vào localStorage
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
        },

        // Xác định chức năng logoutRedux reducer
        logoutRedux: (state, action) => {
            // Xóa trạng thái khi người dùng đăng xuất
            state._id = ""
            state.firstName = ""
            state.lastName = ""
            state.email = ""
            state.image = ""

            // Xóa thông tin đăng nhập khỏi localStorage
            localStorage.removeItem(LOCAL_STORAGE_KEY)
        },
    },
});

// Lấy ra các action được định nghĩa trong slice
export const { loginRedux, logoutRedux } = userSlice.actions

// Export reducer của slice
export default userSlice.reducer;
