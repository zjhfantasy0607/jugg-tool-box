import Link from "next/link";

import SidebarButton from "./header/sidebarButton";
import Search from "./search";
import User from "./header/user";
import { UserInfoDataInterface } from "@/app/template";

export default function Header({
    userInfoData
}: {
    userInfoData: UserInfoDataInterface | null
}) {
  
    return (
        <div className="navbar bg-primary-content h-16 shadow z-50">
            <div className="flex-none text-primary">
                <SidebarButton />
            </div>

            {/* logo */}
            <div className="flex-1 lg:hidden">
                <Link href="/" className="btn btn-ghost h-12 flex items-center justify-center text-lg p-1 text-primary font-bold">JUGG 工具箱</Link>
            </div>

            <div className="flex-1 w-80 hidden lg:block">
                <Search />
            </div>

            <div className="flex-none">
                <User userInfoData={userInfoData}  />
            </div>
        </div>
    );
}
