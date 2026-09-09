import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        allMessages: [],
    },
    reducers: {
        setAllMessages: (state, action) => {
            state.allMessages = action.payload
        },
        addMessage: (state, action) => {
            state.allMessages.push(action.payload)
        }
    }
});

export const { setAllMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;