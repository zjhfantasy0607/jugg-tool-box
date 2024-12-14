'use client'

import UserInfoComponent from "./userInfo";
import { useAppSelector, useToggleDialog, useAppDispatch } from "@/store/hook";
import { selectUserinfo } from '@/store/slices/userinfoSlice';
import { setDialogType } from '@/store/slices/dialogSlice';

export default function User() {

    const reduxDispatch = useAppDispatch();
    const toogleDialog = useToggleDialog();


    const userinfo = useAppSelector(selectUserinfo)
    const isLogin = Boolean(userinfo.email)

    const handleLogin = () => {
        reduxDispatch(setDialogType("login"));
        toogleDialog();
    }

    return (
        <>
            {!isLogin && <button className="btn btn-primary" onClick={handleLogin}>登录 / 注册</button>}
            {isLogin && <UserInfoComponent userInfo={userinfo} />}
        </>
    );
}

