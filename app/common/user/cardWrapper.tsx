'use client'

import { useRef, useState } from "react";
import clsx from 'clsx';

import LoginCard from "./loginCard";
import RegistCard from "./registCard";
import ForgetCard from "./forgetCard";

export default function CardsDialog({ handleCards }: {handleCards: HandleCardsInterface}) {

    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const [cardType, setCardType] = useState<string>('login')
    const [cardShow, setCardShow] = useState<boolean>(false)

    handleCards.showLogin = () => {
        setCardType('login');
    };
    
    handleCards.showRegist = () => {
        setCardType('regist');
    };
    
    handleCards.showForget = () => {
        setCardType('forget');
    };
    
    handleCards.showCard = () => {
        setCardShow(true);
    };
    
    handleCards.hiddenCard = () => {
        setCardShow(false);
    };

    return (
        <dialog id="login_modal" ref={dialogRef} className={clsx("modal", { 'modal-open': cardShow })} onClick={handleCards.hiddenCard}>
            <div className="modal-box card shrink-0 max-w-sm shadow-2xl bg-base-100" onClick={e => e.stopPropagation()}>
                {cardType == 'login' && <LoginCard handleCards={handleCards} />}
                {cardType == 'regist' && <RegistCard handleCards={handleCards} />}
                {cardType == 'forget' && <ForgetCard handleCards={handleCards} />}
            </div>
        </dialog>
    );
}

export interface HandleCardsInterface {
    showLogin(): void;
    showRegist(): void;
    showForget(): void;
    showCard(): void;
    hiddenCard(): void;
}

export interface CardProps {
    handleCards: HandleCardsInterface
}