'use client'

import { useDebouncedCallback } from 'use-debounce';
import { useState, useId } from 'react';
import { useContext } from 'react';
import { RootContext } from '@/app/RootContext';
import Link from 'next/link';

export default function Search() {

    const inputId: string = useId();
    const [search, setSearch] = useState<string>('');
    const rootContextValue  = useContext(RootContext);
    
    const [searchList, setSearchList] = useState<SearchListInterFace[]>([
        { id: 1, title: '图片工具', href: '/test' },
        { id: 2, title: '牛的工具', href: '/' },
        { id: 3, title: '猪的工具', href: '/' }
    ]);

    const debounceChange = useDebouncedCallback((value: string) => {
        value = value.toLowerCase();

        // todo远程获取搜索工具列表
    }, 300);

    function handleChange(e: any) {
        setSearch(e.target.value)
        debounceChange(e.target.value)
    }

    return (
        <div className='w-full relative'>
            <label className="dropdown w-full max-w-xs input input-bordered bg-primary-content flex items-center gap-2">
                <input  id={inputId} onChange={handleChange} value={search} type="text" className="grow" placeholder="搜索工具" maxLength={50} />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>

                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box absolute w-full max-w-xs mt-5 top-full left-0">
                    {searchList.map(item => 
                        <li key={item.id}><Link href={item.href} onClick={rootContextValue?.toggleSidebar}>{item.title}</Link></li>
                    )}
                </ul>
            </label>
        </div>
    );
}

export interface SearchListInterFace {
    id: number,
    title: string,
    href: string
}
