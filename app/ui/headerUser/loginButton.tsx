'use client'

import { useState, useRef } from "react";
import clsx from 'clsx';

import LoginCard from "./cardLogin";
import RegistCard from "./cardRegist";
import ForgetCard from "./cardForget";

export interface CardProps {
    handleCards: HandleCardsInterface
}

export interface HandleCardsInterface {
    showLogin(): void;
    showRegist(): void;
    showForget(): void;
    showCard(): void;
    hiddenCard(): void;
}

export default function LoginButton({ 
    hiddenButton 
}: { 
    hiddenButton: boolean 
}) {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const [cardType, setCardType] = useState<string>('login')
    const [cardShow, setCardShow] = useState<boolean>(false)

    const handleCards: HandleCardsInterface = {
        showLogin: () => setCardType('login'),
        showRegist: () => setCardType('regist'),
        showForget: () => setCardType('forget'),
        showCard: () => setCardShow(true),
        hiddenCard: () => setCardShow(false),
    }

    return (
        <>
            {!hiddenButton && <button className="btn btn-primary" onClick={() => handleCards.showCard()}>登录 / 注册</button>}
            <dialog id="login_modal" ref={dialogRef} className={clsx("modal", { 'modal-open': cardShow })} onClick={handleCards.hiddenCard}>
                <div className="modal-box card shrink-0 max-w-sm shadow-2xl bg-base-100" onClick={e => e.stopPropagation()}>
                    <div className={clsx({ "hidden": cardType !== 'login'  })}><LoginCard  handleCards={handleCards} /></div>
                    <div className={clsx({ "hidden": cardType !== 'regist' })}><RegistCard handleCards={handleCards} /></div>
                    <div className={clsx({ "hidden": cardType !== 'forget' })}><ForgetCard handleCards={handleCards} /></div>
                </div>
            </dialog>
        </>

    );
}