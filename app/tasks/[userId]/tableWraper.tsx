'use client'

import { useState, useEffect } from 'react'
import Pagination from '@/app/ui/pagination/callback'
import { getTasks } from '@/app/lib/api'
import Table, { Task } from './table'
import TableSkeleton from './tableSkeleton'

export default function TableWraper() {

    const len = 7;
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [total, setTotal] = useState<number>(0);
    const [data, setData] = useState<Task[]>([]);

    useEffect(() => {
        fetchData(page);
    }, [page]);

    // 数据请求函数
    const fetchData = async (page: number) => {
        setLoading(true); // 开始加载，显示骨架屏

        const start = (page - 1) * len;
        const data: { tasks: [], total: number } = await getTasks(start, len) || { tasks: [], total: 0 };

        setLoading(false);
        setTotal(data.total);
        setData(data.tasks);
    };

    const pageCallback = (page: number) => {
        setPage(page)
    }

    return (
        <div>
            {/* <div className='m-5 h-10 border rounded-sm'>
                <input className='w-full h-full input input-border' placeholder='搜索任务...' type="text" />
            </div> */}
            {loading && <TableSkeleton len={len} />}
            {!loading && <Table tableData={data} />}
            {total > 0 && <Pagination page={page} total={total} len={len} buttonNum={7} callback={pageCallback} />}
        </div>
    )
}