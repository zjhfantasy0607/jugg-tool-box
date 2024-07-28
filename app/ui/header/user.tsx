'use client'

import { useState, useRef } from "react";
import clsx from 'clsx';

import { UserInfoDataInterface } from "@/app/template";
import UserInfo from "./userInfo";
import LoginCard from "./cardLogin";
import RegistCard from "./cardRegist";
import ForgetCard from "./cardForget";

export default function User({
    userInfoData,
}: {
    userInfoData: UserInfoDataInterface | null
}) {
    const [cardType, setCardType] = useState<string>('login');
    const [cardShow, setCardShow] = useState<boolean>(false);
    const isLogin = Boolean(userInfoData);

    const handleCardsRef = useRef<HandleCardsInterface>({
        showLogin: () => setCardType('login'),
        showRegist: () => setCardType('regist'),
        showForget: () => setCardType('forget'),
        showCard: () => setCardShow(true),
        hiddenCard: () => {
            // 执行关闭前事件，根据关闭前事件的返回来决定是否关闭卡片显示
            if (handleCardsRef.current.beforeHiddenCard()) {
                setCardShow(false);
            }
            // 重置关闭任务
            handleCardsRef.current.beforeHiddenCard = () => true;
        },
        beforeHiddenCard: () => true
    });

    return (
        <>
            {!isLogin && <button className="btn btn-primary" onClick={() => handleCardsRef.current.showCard()}>登录 / 注册</button>}

            {isLogin && <UserInfo userInfoData={userInfoData as UserInfoDataInterface} />}

            <dialog id="login_modal" className={clsx("modal", { 'modal-open': cardShow })} onClick={handleCardsRef.current.hiddenCard}>
                <div className="modal-box card shrink-0 max-w-sm shadow-2xl bg-base-100" onClick={e => e.stopPropagation()}>
                    <div className={clsx({ "hidden": cardType !== 'login' })}><LoginCard handleCards={handleCardsRef.current} /></div>
                    <div className={clsx({ "hidden": cardType !== 'regist' })}><RegistCard handleCards={handleCardsRef.current} /></div>
                    <div className={clsx({ "hidden": cardType !== 'forget' })}><ForgetCard handleCards={handleCardsRef.current} /></div>
                </div>
            </dialog>
        </>
    );
}

export interface CardProps {
    handleCards: HandleCardsInterface
}

export interface HandleCardsInterface {
    showLogin(): void;
    showRegist(): void;
    showForget(): void;
    showCard(): void;
    hiddenCard(): void;
    beforeHiddenCard(): boolean
}

