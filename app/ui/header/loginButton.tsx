'use client'

import UserInfoComponent from "./userInfo";
import { useAppSelector, useToggleDialog } from "@/store/hook";
import { selectUserinfo } from '@/store/slices/userinfoSlice';

export default function User() {

    const toogleDialog = useToggleDialog()
    
    const userinfo = useAppSelector(selectUserinfo)
    const isLogin = Boolean(userinfo.email)

    return (
        <>
            {!isLogin && <button className="btn btn-primary" onClick={toogleDialog}>登录 / 注册</button>}
            {isLogin && <UserInfoComponent userInfo={userinfo} />}
        </>
    );
}

