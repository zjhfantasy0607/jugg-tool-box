import { cookies } from "next/headers";

import Header from "@/app/ui/header";
import ToolList from "./ui/toolList";
import { getUserInfoData } from "@/app/lib/data";

export default async function Template({ children }: { children: React.ReactNode }) {

    const token = cookies().get('token')?.value || '';
    const userInfoData: UserInfoDataInterface | null = await getUserInfoData(token);

    return (
        <div className="drawer lg:drawer-open overflow-hidden">
            <input id="jugg-global-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center bg-primary-content h-svh overflow-hidden">
                {/* Page content here */}
                <Header userInfoData={userInfoData} />
                <main className="w-full min-h-full overflow-y-auto">
                    {children}
                </main>
            </div>
            <div className="drawer-side border-r">
                <label htmlFor="jugg-global-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ToolList />
            </div>
        </div>
    )
}

export interface UserInfoDataInterface {
    name: string,
    email: string,
    points: number
}