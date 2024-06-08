import Link from "next/link";

import { useContext } from 'react';
import { RootContext } from "@/app/RootContext";

import UserCards from "./user/user";
import Search from "./search";

export default function Header() {

    const rootContextValue  = useContext(RootContext);

    return (
        <div className="navbar bg-primary-content h-16 shadow">
            <div className="flex-none text-primary">
                <div onClick={rootContextValue.toggleSidebar} className="btn btn-square btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </div>
            </div>

            {/* logo */}
            <div className="flex-1 lg:hidden">
                <Link href="/" className="btn btn-ghost h-12 flex items-center justify-center text-lg p-1 text-primary font-bold">JUGG 工具箱</Link>
            </div>

            <div className="flex-1 w-80 hidden lg:block">
                <Search />
            </div>

            <div className="flex-none">
                <UserCards />
            </div>
        </div>
    );
}
