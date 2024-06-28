import Link from "next/link";
import { cookies } from "next/headers";

import SidebarButton from "./header/sidebarButton";
import Search from "./search";
import User, { UserInfoDataInterface } from "./header/user";
import { getUserInfoData } from "@/app/lib/data";


export default async function Header() {

    const token = cookies().get('token')?.value || '';
    const userInfoData: UserInfoDataInterface | null = await getUserInfoData(token);
  
    return (
        <div className="navbar bg-primary-content h-16 shadow">
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
