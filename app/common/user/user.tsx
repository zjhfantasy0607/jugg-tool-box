import { useContext, Suspense } from 'react';
import { RootContext } from "@/app/RootContext";

import CardsDialog, { HandleCardsInterface } from "./cardWrapper";
import UserInfo from './userInfo';

export default function User() {

    const rootContextValue  = useContext(RootContext);

    const handleCards: HandleCardsInterface = {
        showLogin: ()=>{},
        showRegist: ()=>{},
        showForget: ()=>{},
        showCard: ()=>{},
        hiddenCard: ()=>{},
    }

    return (
        <div>
            {!rootContextValue.token && <button className="btn btn-primary" onClick={() => handleCards.showCard()}>登录 / 注册</button>}
            {rootContextValue.token && 
                <Suspense fallback={<button className="btn btn-primary" onClick={() => handleCards.showCard()}>登录 / 注册</button>}>
                    <UserInfo />
                </Suspense>
            }   
                

            <CardsDialog handleCards={handleCards} />
        </div>
    );
}