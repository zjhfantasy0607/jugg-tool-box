'use client'

import Link from "next/link";
import { ToggleGlobalSidebar } from "@/app/lib/utils";
import { Tool } from "@/app/ui/toolList";

export default function ToolListChild({
    tool
} : {
    tool: Tool
}) {
    return (
        <li>
            <details open>
                <summary>
                    <span dangerouslySetInnerHTML={{ __html: tool.icon }} />
                    {tool.title}
                </summary>
                <ul>
                    {tool.children?.map((item: Tool) => <li key={item.id}><Link onClick={ToggleGlobalSidebar} href={item.url}>{item.title}</Link></li>)}
                </ul>
            </details>
        </li>
    );
}
