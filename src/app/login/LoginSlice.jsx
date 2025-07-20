import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GetApi } from "@/lib/ApiCall";

const initialState = {
    userId: '',
    userName: '',
    userMail: '',
    userJoinedOn: '',
    home: '',
    favs: [],
    session: '',
}

export const getUserData = createAsyncThunk('user/getUserData', async () => {
    const response = await GetApi('UserData')
    const data = await response.data
    if (data.Status === 'Success') {
        return data.Data;
    }
})

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logOut: (state, action) => {
            state.userId = '',
            state.userName = '',
            state.userMail = '',
            state.userJoinedOn = '',
            state.home = '',
            state.favs = [],
            state.session = 'loggedOut'
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserData.fulfilled, (state, action) => {
                state.userId = action.payload.id,
                state.userName = action.payload.name,
                state.userMail = action.payload.mailId,
                state.userJoinedOn = action.payload.joinedOn,
                state.home = action.payload.home,
                state.favs = action.payload.favs,
                state.session = 'loggedIn'
            })
    }
})

export const loggedUserId = state => state.user.userId
export const loggedUserName = state => state.user.userName
export const loggedUserMail = state => state.user.userMail
export const loggedUserJoinedOn = state => state.user.userJoinedOn
export const loggedUserHome = state => state.user.home
export const loggedUserFavs = state => state.user.favs
export const sessionStatus = state => state.user.session

export const { logOut } = userSlice.actions

export default userSlice.reducer
