'use client'

import Link from "next/link";
import { ToggleGlobalSidebar } from "@/app/lib/utils";
import { Tool } from "@/app/lib/apiTypes";
import { usePathname } from 'next/navigation';
import clsx from "clsx";

export default function ToolListChild({
    tool
}: {
    tool: Tool
}) {
    const pathname = usePathname();

    return (
        <li>
            <details open>
                <summary>
                    <span dangerouslySetInnerHTML={{ __html: tool.icon }} />
                    <span className="font-medium text-base lg:text-sm  text-gray-950">{tool.title}</span>
                </summary>
                <ul>
                    {tool.children?.map((item: Tool) =>
                        <li key={item.id}>
                            <Link className={clsx({ active: pathname.startsWith(item.url) })} onClick={ToggleGlobalSidebar} href={item.url}>
                                <span className="text-sm">{item.title}</span>
                            </Link>
                        </li>)}
                </ul>
            </details>
        </li>
    );
}
