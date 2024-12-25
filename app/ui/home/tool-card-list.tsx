import ToolCard from "@/app/ui/home/tool-card";
import { Tool } from "@/app/lib/apiTypes";

export default function ToolCardList({
    data
}: {
    data: Tool[]
}) {
    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" />
                </svg>
                <h2 className="font-bold ml-2">工具列表</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                {data.map((item: Tool) => <ToolCard key={item.id} title={item.title} description={item.description} icon={item.icon} url={item.url} />)}
            </div>
        </div>
    )
}