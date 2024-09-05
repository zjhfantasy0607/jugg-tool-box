import { getTasks } from '@/app/lib/api'
import Table, { Task } from './table'
import TableSkeleton from './tableSkeleton'
import { Suspense } from 'react'
import Pagination from '@/app/ui/pagination'

export default function Tasks({ params }: { params: { userId: string[] } }) {
    const page = Number(params.userId[1]) || 1
    return (
        <div>
            <Suspense fallback={<TableSkeleton />}>
                <TableWraper page={page} />
            </Suspense>
        </div>
    )
}

async function TableWraper({ page }:{ page: number }) {
    const len = 8
    const start = (page - 1) * len

    const data = await getTasks(start, len) || []
    return (
        <div>
            <Table tableData={data.tasks} />
            <Pagination page={page} total={data.total} len={len} buttonNum={7} />
        </div>
    )
}