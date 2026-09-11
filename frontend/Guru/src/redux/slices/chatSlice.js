import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        allMessages: [],
        allConversations: [],
    },
    reducers: {
        setAllMessages: (state, action) => {
            state.allMessages = action.payload
        },
        addMessage: (state, action) => {
            state.allMessages.push(action.payload)
        },
        setAllConversations: (state, action) => {
            state.allConversations = action.payload
        },
        addConversation: (state, action) => {
            state.allConversations.push(action.payload)
        }
    }
});

export const { setAllMessages, addMessage, setAllConversations, addConversation } = chatSlice.actions;
export default chatSlice.reducer;
