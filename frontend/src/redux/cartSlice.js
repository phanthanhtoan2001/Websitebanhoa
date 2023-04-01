import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        total: 0,
    },
    reducers: {
        setCartItems: (state, action) => {
            state.items = [...action.payload];
        },
        setCartTotal: (state, action) => {
            state.total = action.payload;
        },
    },
});

export const { setCartItems, setCartTotal } = cartSlice.actions;

export default cartSlice.reducer;
