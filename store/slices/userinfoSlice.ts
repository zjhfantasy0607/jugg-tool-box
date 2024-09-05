import { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from "@/store/createAppSlice"
import { getUserInfoData } from '@/app/lib/api';

export interface UserInfo {
    uid: string
    name: string
    email: string
    points: number
}

const initUserinfo = {
    userInfo: {
        uid: '',
        name: '',
        email: '',
        points: 0,
    },
    browserId: ''
}

export const userinfoSlice = createAppSlice({
    name: 'userinfo',
    initialState: initUserinfo,
    reducers: (create) => ({
        setUserinfo: create.reducer((state, action: PayloadAction<UserInfo>) => {
            state.userInfo.name = action.payload.name;
            state.userInfo.email = action.payload.email;
            state.userInfo.points = action.payload.points;
            state.userInfo.uid = action.payload.uid;
        }),
        setBrowserId: create.reducer((state, action: PayloadAction<string>) => {
            state.browserId = action.payload
        }),
        cleanUserinfo: create.reducer(state => {
            state.userInfo.name = '';
            state.userInfo.email = '';
            state.userInfo.points = 0;
        }),
        updateUserinfo: create.asyncThunk(
            async () => {
                return await getUserInfoData();
            },
            {
                pending: (state) => {

                },
                fulfilled: (state, action) => {
                    if (action.payload) {
                        state.userInfo.name = action.payload.name;
                        state.userInfo.email = action.payload.email;
                        state.userInfo.points = action.payload.points;
                        state.userInfo.uid = action.payload.uid;
                    }
                },
                rejected: (state) => {

                },
            },
        )
    }),
    selectors: {
        selectUserinfo: (userinfo) => userinfo.userInfo,
        selectBrowserId: (userinfo) => userinfo.browserId
    }
})

export const { setUserinfo, cleanUserinfo, updateUserinfo, setBrowserId } = userinfoSlice.actions

export const { selectUserinfo, selectBrowserId } = userinfoSlice.selectors;

