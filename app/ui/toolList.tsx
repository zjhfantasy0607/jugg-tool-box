import Link from "next/link";

import Search from "./search";
import ToolListItem from "./toolist/toolListItem";

export default function ToolList() {
    return (
        <ul className="min-h-full menu bg-primary-content p-4 w-80  text-base-content">
            {/* PC端 logo */}
            <div>
                <Link href="/" className="h-12 hidden lg:flex items-center justify-center text-xl text-primary font-bold">JUGG 工具箱</Link>
            </div>

            {/* 手机端搜索框 */}
            <div className="lg:hidden mb-5">
                <Search />
            </div>

            <ToolListItem />
        </ul>
    );
}
