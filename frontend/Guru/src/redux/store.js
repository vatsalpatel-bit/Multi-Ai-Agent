import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.js"
import chatReducer from "./slices/chatSlice.js"

const store = configureStore({
    reducer: {
        user: userReducer,
        chat: chatReducer,
    },
    devTools: true,
});


export default store;