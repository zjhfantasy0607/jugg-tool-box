'use client'

import { createContext } from 'react';

export const RootContext = createContext<RootContextInterface>({ toggleSidebar: ()=>{}, token: ''});

export interface RootContextInterface {
    toggleSidebar(): void
    token: string
}

export default function RootContextProvider({ 
    children, 
    token 
}: { 
    children: React.ReactNode, 
    token: string 
}) {

    const rootContextInitValue: RootContextInterface = {
        toggleSidebar: () => {},
        token: token
    }

    return <RootContext.Provider  value={rootContextInitValue}>{children}</RootContext.Provider>
}