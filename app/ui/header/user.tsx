'use client'

import { useState, useRef } from "react";
import clsx from 'clsx';

import UserInfo from "./userInfo";
import LoginCard from "./cardLogin";
import RegistCard from "./cardRegist";
import ForgetCard from "./cardForget";
import CaptchaCard from "./cardCaptcha";

export default function User({ 
    userInfoData,
}: { 
    userInfoData: UserInfoDataInterface | null 
}) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    
    const [cardPrevType, setCardPrevType] = useState<string>('');
    const [cardType, setCardType] = useState<string>('login');
    const [cardShow, setCardShow] = useState<boolean>(false);
    const userEmailRef = useRef<string>('');

    function setCardTypeFunc(type: string) {
        setCardPrevType(cardType);
        setCardType(type);
    }

    const handleCards: HandleCardsInterface = {
        getCardType: () => cardType,
        getUserEmail: () => userEmailRef.current,
        setUserEmail: (email: string) => {userEmailRef.current = email},

        showLogin: () => setCardTypeFunc('login'),
        showRegist: () => setCardTypeFunc('regist'),
        showCaptcha: () => setCardTypeFunc('captcha'),
        showForget: () => setCardTypeFunc('forget'),

        showCard: () => setCardShow(true),
        hiddenCard: () => {
            if (cardType == 'captcha') {
                setCardTypeFunc(cardPrevType);
            } else {
                setCardShow(false);
            }
        }
    }

    return (
        <>
            {!Boolean(userInfoData) && <button className="btn btn-primary" onClick={() => handleCards.showCard()}>登录 / 注册</button>}

            {Boolean(userInfoData) && <UserInfo userInfoData={userInfoData as UserInfoDataInterface} />}

            <dialog id="login_modal" ref={dialogRef} className={clsx("modal", { 'modal-open': cardShow })} onClick={handleCards.hiddenCard}>
                <div className="modal-box card shrink-0 max-w-sm shadow-2xl bg-base-100" onClick={e => e.stopPropagation()}>
                    <div className={clsx({ "hidden": cardType !== 'login'  })}><LoginCard  handleCards={handleCards} /></div>
                    <div className={clsx({ "hidden": cardType !== 'regist' })}><RegistCard handleCards={handleCards} /></div>
                    <div className={clsx({ "hidden": cardType !== 'forget' })}><ForgetCard handleCards={handleCards} /></div>
                    <div className={clsx({ "hidden": cardType !== 'captcha' })}>{ cardShow && cardType === 'captcha' && <CaptchaCard handleCards={handleCards} /> }</div>
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
    showCaptcha(): void;
    showForget(): void;
    showCard(): void;
    hiddenCard(): void;

    getCardType(): string;
    getUserEmail(): string;
    setUserEmail(email: string): void;
}

export interface UserInfoDataInterface {
    name:   string,
    email:  string,
    points: number
}