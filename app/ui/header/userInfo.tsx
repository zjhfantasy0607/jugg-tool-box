'use client'

import { signOut } from '@/app/lib/actions'
import toast from 'react-hot-toast'
import { UserInfo } from '@/store/slices/userinfoSlice'
import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hook'
import { cleanUserinfo } from '@/store/slices/userinfoSlice'
import { progressStart, selectIsEnd } from "@/store/slices/progressSlice"
import { useSpring, animated } from '@react-spring/web'
import clsx from 'clsx'
import Link from 'next/link'
import { useToggleDialog } from "@/store/hook";
import { setDialogType } from '@/store/slices/dialogSlice';

export default function ({
    userInfo
}: {
    userInfo: UserInfo
}) {
    const toogleDialog = useToggleDialog()

    const eleRef = useRef<HTMLUListElement>(null)
    const reduxDispatch = useAppDispatch();
    const isEnd = useAppSelector(selectIsEnd);

    async function handleSignOut() {
        const response = await signOut();
        if (response?.code == 200) {
            reduxDispatch(cleanUserinfo())
            toast.success('退出成功');
        }
    }

    // 启动任务检查
    useEffect(() => {
        if (userInfo.email) {
            reduxDispatch(progressStart())
        }
    }, []);

    const props = useSpring({
        points: userInfo.points,
    })

    // 下拉窗点击自动关闭
    function dropdownHandleClick(e: React.MouseEvent<HTMLLIElement>) {
        if (eleRef.current) {
            eleRef.current.blur()
            // 找到所有可以获得焦点的子元素
            const focusableElements = eleRef.current.querySelectorAll('input, button, textarea, select, a[href], [tabindex]');
            // 遍历并移除焦点
            focusableElements.forEach((el: any) => {
                (el as HTMLElement).blur();
            });
        }
    }

    function handleChangePassword() {
        reduxDispatch(setDialogType("forget"));
        toogleDialog();
    }

    return (
        <div className="text-primary flex items-center dropdown dropdown-end relative">
            <div className="hidden lg:flex items-center mr-6 cursor-pointer text-sm" tabIndex={0} role="button">
                <div className={clsx("bulb-container", { active: !isEnd })}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                    <div className="ripple"></div>
                    <div className="ripple ripple-2"></div>
                    <div className="ripple ripple-3"></div>
                </div>
                <animated.span className="mx-0.5">{props.points.to(v => `${v.toFixed(0)}`)}</animated.span>
            </div>

            {/* 电脑端用户图标 */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 hidden lg:block">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>

            {/* 手机端用户图标 */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 lg:hidden">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>

            <div className="text-xs lg:text-sm flex flex-col cursor-pointer" tabIndex={0} role="button">
                <span className="mx-0.5 mt-0.5 lg:mt-0">{userInfo.email}</span>
                <div className="flex items-center mt-[-3px] lg:hidden">
                    <span className="mx-0.5">{userInfo.points}</span>
                    <div className={clsx("bulb-container", { active: !isEnd })}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                        </svg>
                        <div className="ripple"></div>
                        <div className="ripple ripple-2"></div>
                        <div className="ripple ripple-3"></div>
                    </div>
                </div>
            </div>

            <ul ref={eleRef} tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-44 absolute top-full mt-6">
                <li onClick={dropdownHandleClick}><Link href={`/points/${userInfo.uid}`}>积分记录</Link></li>
                <li onClick={dropdownHandleClick}><Link href={`/tasks/${userInfo.uid}`}>任务记录</Link></li>
                <li onClick={dropdownHandleClick}><a onClick={handleChangePassword}>修改密码</a></li>
                <li onClick={dropdownHandleClick}><a onClick={handleSignOut}>退出登录</a></li>
            </ul>
        </div>
    );
}
