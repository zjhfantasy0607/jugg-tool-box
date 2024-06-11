'use client'

import { ToggleGlobalSidebar } from "@/app/lib/utils";

export default function SidebarButton() {

    return (
        <div onClick={ToggleGlobalSidebar} className="btn btn-square btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </div>
    );
}
