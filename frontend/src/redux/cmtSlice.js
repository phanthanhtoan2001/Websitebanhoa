import { createSlice } from "@reduxjs/toolkit";

// Tạo gia trị khởi tạo cho state của comments
const initialState = {
  comments: [],
};

// Tạo một slice mới cho comments
export const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment: (state, action) => {
      // Thêm comment mới vào mảng
      state.comments.push(action.payload);
    },
  },
});

// Lấy reducer từ slice
export const { addComment } = commentsSlice.actions;

// Export reducer của slice 
export default commentsSlice.reducer;
