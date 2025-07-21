import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null
}

export const weatherSlice = createSlice({
    name: 'weather',
    initialState,
    reducers: {
        updateWeather: (state, action) => {
            state.data = action.payload
        }
    }
})

export const lastWeatherData = state => state.data;

export const { updateWeather } = weatherSlice.actions

export default weatherSlice.reducer;
