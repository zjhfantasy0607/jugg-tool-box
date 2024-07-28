import Link from "next/link";

import Search from "./search";
import ToolListChild from "./toolListChild";
import { getToolsTree } from "@/app/lib/data";

export default async function ToolList() {

    const toolTree: ToolTree = await getToolsTree();

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

            {toolTree?.data?.tools.map((item: Tool) => <ToolListChild key={item.id} tool={item} />)}
        </ul>
    );
}

export interface Tool {
    id: number;
    pid: number;
    title: string;
    icon: string;
    url: string;
    created_at: string;
    updated_at: string;
    Orders: number;
    children?: Tool[];
}

export interface ToolTree {
    code: number;
    data: {
        tools: Tool[];
    };
    msg: string;
}
