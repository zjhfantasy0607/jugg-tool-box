'use client'

import ImgCard from "@/app/ui/home/img-card";
import { PhotoProvider } from 'react-photo-view';
import { Task } from '@/app/lib/apiTypes';

export default function ImgCardList({ data }: {
    data: Task[]
}) {
    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                </svg>
                <h2 className="font-bold ml-2">生成实例</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-4">
                <PhotoProvider>
                    {data.map((item: Task) => {
                        const imgurl = JSON.parse(item.output)[0].replace(/\\/g, '/');
                        const title = JSON.parse(item.params)?.prompt || '';
                        const url = item.tool_url + `/${item.task_id}`;
                        return <ImgCard key={item.task_id} title={title} url={url} imgurl={imgurl} />
                    })}
                </PhotoProvider>
            </div>
        </div>
    )
}