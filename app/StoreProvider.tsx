'use client'
import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '@/store/store'
import FingerprintJS from '@fingerprintjs/fingerprintjs';

import { setUserinfo, setBrowserId, UserInfo } from '@/store/slices/userinfoSlice'

export default function StoreProvider({
    children,
    userinfo
}: {
    children: React.ReactNode
    userinfo: UserInfo | null
}) {
    const storeRef = useRef<AppStore>()

    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore()

        // 初始化用户信息
        if (userinfo !== null) {
            storeRef.current.dispatch(setUserinfo(userinfo))
        }
    }

    useEffect(() => {
        (async () => { // 初始化设备id
            let browserId = localStorage.getItem('browserId')
            if (!browserId) {
                const fp = await FingerprintJS.load()
                const result = await fp.get()
                localStorage.setItem('browserId', result.visitorId)
                browserId =  result.visitorId
            }
            storeRef?.current?.dispatch(setBrowserId(browserId))
        })()
    }, []);

    return <Provider store={storeRef.current}>{children}</Provider>
}