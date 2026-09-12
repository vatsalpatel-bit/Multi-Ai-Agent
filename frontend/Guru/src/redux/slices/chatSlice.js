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
        },
        updateConversation: (state, action) => {
            const { conversationId, title } = action.payload;

            const conversation = state.allConversations.find(
                (conversation) =>
                    conversation._id === conversationId
            );

            if (conversation) {
                conversation.title = title;
            }
        },
    }
});

export const { setAllMessages, addMessage, setAllConversations, addConversation, moveConversationOnTop, updateConversation } = chatSlice.actions;
export default chatSlice.reducer;
