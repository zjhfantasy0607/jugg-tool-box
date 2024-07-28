import { createSlice } from '@reduxjs/toolkit'

interface UserInfo {
    name: string;
    email: string;
    points: number;
}

const initUserinfo: UserInfo = {
    name: '',
    email: '',
    points: 0,
}

const userinfoSlice = createSlice({
    name: 'userinfo',
    initialState: initUserinfo,
    reducers: {
        setUserinfo: state => {
            
        },
        cleanUserinfo: state => {
           
        }
    }
})

export const { setUserinfo, cleanUserinfo } = userinfoSlice.actions

