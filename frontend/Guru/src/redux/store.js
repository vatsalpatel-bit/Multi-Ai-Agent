import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice.js"
import chatReducer from "./slices/chatSlice.js"
import artifactReducer from "./slices/artifactSlice.js";

const store = configureStore({
    reducer: {
        user: userReducer,
        chat: chatReducer,
        artifact: artifactReducer,
    },
    devTools: true,
});


export default store;