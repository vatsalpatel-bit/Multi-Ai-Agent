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
            state.allConversations.unshift(action.payload)
        },
        moveConversationOnTop: (state, action) => {
            const conversationId = action.payload;

            const index = state.allConversations.findIndex(
                (conversation) => conversation._id === conversationId
            );

            if (index <= 0) return;

            const [conversation] = state.allConversations.splice(index, 1);
            state.allConversations.unshift(conversation);
        }
    }
});

export const { setAllMessages, addMessage, setAllConversations, addConversation, moveConversationOnTop } = chatSlice.actions;
export default chatSlice.reducer;
