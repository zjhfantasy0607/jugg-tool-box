'use client'

import { useState, useEffect } from 'react'
import Pagination from '@/app/ui/pagination/callback'
import { getPoints } from '@/app/lib/api'
import Table, { PointRecord } from './table'
import TableSkeleton from './tableSkeleton'

export default function TableWraper() {

    const len = 8;
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [total, setTotal] = useState<number>(0);
    const [data, setData] = useState<PointRecord[]>([]);

    useEffect(() => {
        fetchData(page);
    }, [page]);

    // 数据请求函数
    const fetchData = async (page: number) => {
        setLoading(true); // 开始加载，显示骨架屏

        const start = (page - 1) * len;
        const data: { points: [], total: number } = await getPoints(start, len) || { points: [], total: 0 };

        setLoading(false);
        setTotal(data.total);
        setData(data.points);
    };

    const pageCallback = (page: number) => {
        setPage(page)
    }

    return (
        <div>
            {loading && <TableSkeleton len={len} />}
            {!loading && <Table tableData={data} />}
            {total > 0 && <Pagination page={page} total={total} len={len} buttonNum={7} callback={pageCallback} />}
        </div>
    )
}