'use client'

import clsx from "clsx"

export default function Table({
    tableData
}: {
    tableData: PointRecord[]
}) {
    return (
        <div className="table-background m-5 my-2 border-gray-300 rounded-md">
            <div className='overflow-x-auto mx-2'>
                <table className="table table-sm xl:table-md table-pin-rows table-pin-cols">
                    <thead>
                        <tr>
                            <td>记录时间</td>
                            <td className="text-left">积分记录</td>
                            <td>积分变化</td>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map(item =>
                            <tr key={item.id}>
                                <td>{item.created_at}</td>
                                <td className="min-w-36 text-left">{item.remark}</td>
                                <td className={clsx({
                                    "text-red-500": item.points < 0,
                                    "text-green-500": item.points > 0,
                                })}>{item.points > 0 && '+'}{item.points}</td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>记录时间</td>
                            <td className="text-left">积分记录</td>
                            <td>积分变化</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}

export interface PointRecord {
    id: number
    task_id: string
    uid: string
    points: number
    remark: string
    created_at: string
    updated_at: string
}