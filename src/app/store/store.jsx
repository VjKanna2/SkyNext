import { configureStore } from "@reduxjs/toolkit"
import UserReducer from "@/app/login/LoginSlice";

export const weather_store = configureStore({
    reducer: {
        user: UserReducer
    }
})