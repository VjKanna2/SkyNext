import { configureStore } from "@reduxjs/toolkit"
import UserReducer from "@/app/slices/User";
import WeatherReducer from '@/app/slices/Weather'

export const weather_store = configureStore({
    reducer: {
        user: UserReducer,
        weather: WeatherReducer
    }
})