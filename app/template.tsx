'use client'

import Link from "next/link";
import Header from "./common/header";
import Search from "./common/search";

import { useContext } from 'react';
import { RootContext } from "@/app/RootContext";

export default function Template({ children }: { children: React.ReactNode }) {

    const rootContextValue  = useContext(RootContext);

    // 设置全局的控制侧边栏显示方法
    rootContextValue.toggleSidebar = () => {
        const lgWidth = 1024;
        const windowWidth = window.innerWidth;

        if (windowWidth < lgWidth) {
            const myDrawer = document.getElementById('jugg-global-drawer') as HTMLInputElement;
            myDrawer.checked = !myDrawer.checked;
        }
    }

    return (
        <div className="drawer lg:drawer-open">
            <input id="jugg-global-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center bg-primary-content">
                {/* Page content here */}
                <Header />
                <main className="w-full h-full overflow-auto">
                    {children}
                </main>
            </div>
            <div className="drawer-side border-r">
                <label htmlFor="jugg-global-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="min-h-full menu bg-primary-content p-4 w-80  text-base-content">
                    {/* PC端 logo */}
                    <div>
                        <Link href="/" className="h-12 hidden lg:flex items-center justify-center text-xl text-primary font-bold">JUGG 工具箱</Link>
                    </div>

                    {/* 手机端搜索框 */}
                    <div className="lg:hidden mb-5">
                        <Search />
                    </div>

                    <li>
                        <details open>
                            <summary>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-green-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>AI 图片工具
                            </summary>
                            <ul>
                                <li><Link onClick={rootContextValue.toggleSidebar} href="/">高清修复</Link></li>
                                <li><a>AI 智能去除背景</a></li>
                                <li><a>AI 文生图</a></li>
                            </ul>
                        </details>
                    </li>

                </ul>
            </div>
        </div>
    )
}