'use client'

import './page.css'
import { useRef, useEffect, useState } from 'react'
import Link from "next/link"
import toast from 'react-hot-toast'
import { useAppSelector } from "@/store/hook"
import { selectTasks, Tasks } from "@/store/slices/progressSlice"
import Image from 'next/image'
import clsx from 'clsx'

export default function Table({
    tableData
}: {
    tableData: Task[]
}) {
    const progress = useAppSelector(selectTasks)

    async function HandleTooltip(e: React.MouseEvent<HTMLDivElement>) {
        // 获取被点击的元素
        const element = e.currentTarget;
        // 获取自定义属性 data-taskid 的值
        const taskId = element.getAttribute('data-tip');

        if (taskId) {
            try {
                await navigator.clipboard.writeText(taskId);
                toast.success('复制成功')
            } catch (err) {
                // 使用 document.execCommand 作为备用方案
                const textArea = document.createElement("textarea");
                textArea.value = taskId;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    toast.success('复制成功');
                } catch (error) {
                    console.error("备用复制失败", error);
                }
                document.body.removeChild(textArea);
            }
        }
    }

    return (
        <div className="table-background m-5 border border-gray-300 rounded-md">
            <div className='overflow-x-auto mx-2'>
                <table className="table table-sm xl:table-md table-pin-rows table-pin-cols">
                    <thead>
                        <tr>
                            <th>任务id</th>
                            <td>使用工具</td>
                            <td>消耗积分</td>
                            <td>创建时间</td>
                            <td>开始时间</td>
                            <td>结束时间</td>
                            <td>当前状态</td>
                            <td>预览图</td>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map(item =>
                            <tr key={item.task_id}>
                                <th className='p-0'>
                                    <div className="tooltip tooltip-right mytooltip" data-tip={item.task_id} onClick={HandleTooltip}>
                                        <button className="cursor-pointer truncate w-14">{item.task_id}</button>
                                    </div>
                                </th>
                                <td className="min-w-36">{item.tool_title}</td>
                                <td>{item.used_points}</td>
                                <td className="min-w-36">{item.created_at}</td>
                                <td className="min-w-36">{item.start_time}</td>
                                <Status task={item} progress={progress} />
                                <td className='w-20 h-14 lg:h-16 !px-2 !py-1'>
                                    <div className='w-full h-full relative overflow-hidden'>
                                        <ThumbImage task={item} />
                                    </div>
                                </td>
                                <th className="min-w-16">
                                    <Link href={`${item.tool_url}/${item.task_id}`}>查看</Link>
                                </th>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>任务id</th>
                            <td>使用工具</td>
                            <td>消耗积分</td>
                            <td>创建时间</td>
                            <td>开始时间</td>
                            <td>结束时间</td>
                            <td>当前状态</td>
                            <td>预览图</td>
                            <th>操作</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}

type StatusType = 'pending' | 'producing' | 'success' | 'failed'

export interface Task {
    id: number
    task_id: string
    uid: string
    used_points: number
    tool: string
    tool_title: string
    tool_url: string
    output: string
    status: StatusType
    start_time: string
    end_time: string
    created_at: string
    updated_at: string
}

function Status({
    task,
    progress
}: {
    task: Task
    progress: Tasks
}) {
    const progressRef = useRef<number>(0);
    let status = task.status;

    if (progress[task.task_id]) {
        status = progress[task.task_id].status;
        progressRef.current = progress[task.task_id].progress * 100;
    } else if (progressRef.current > 0) {
        status = "success";
    }

    const getStatusLabel = () => {
        switch (status) {
            case 'success':
                return <span className="text-green-500">完成</span>;
            case 'failed':
                return <span className="text-error">失败</span>;
            case 'pending':
                return <span className="text-warning">排队中</span>;
            case 'producing':
                return <span className="text-info">{progressRef.current.toFixed(0)}%</span>;
            default:
                return null;
        }
    };

    return (
        <>
            <td className="min-w-36">
                {task.end_time === '0001-01-01 00:00:00' ? '' : task.end_time}
            </td>
            <td>
                {getStatusLabel()}
            </td>
        </>
    );
}

// function Status({
//     task,
//     progress
// }: {
//     task: Task
//     progress: Tasks
// }) {
//     const progressRef = useRef<number>(0);
//     // const [status, setStatus] = useState(task.status);

//     let status = task.status;
//     if (progress[task.task_id]) {
//         status = progress[task.task_id].status;
//         progressRef.current = progress[task.task_id].progress * 100;
//     } else if (progressRef.current > 0) {
//         status = "success"
//     }

//     // useEffect(() => {
//     //     if (progress[task.task_id]) {
//     //         setStatus(progress[task.task_id].status);
//     //         progressRef.current = progress[task.task_id].progress * 100;
//     //     } else if (progressRef.current > 0) {
//     //         setStatus('success');
//     //         endTime.current = endTime.current || GetFormattedDateTime();
//     //     }
//     // }, [progress]);

//     return (
//         <>
//             <td className="min-w-36">{task.end_time === '0001-01-01 00:00:00' ? '' : task.end_time}</td>
//             <td>
//                 <span className={clsx("text-green-500", { hidden: status !== 'success' })}>完成</span>
//                 <span className={clsx("text-error", { hidden: status !== 'failed' })}>失败</span>
//                 <span className={clsx("text-warning", { hidden: status !== 'pending' })}>排队中</span>
//                 <span className={clsx("text-info", { hidden: status !== 'producing' })}>{progressRef.current.toFixed(0)}%</span>
//             </td>
//         </>
//     )
// }

function ThumbImage({ task }: { task: Task }) {
    const output = JSON.parse(task.output)[0] || ''
    const imgsrc = output.replace(/\\/g, '/')

    return (
        <>
            {imgsrc && <Image className='m-auto object-contain' fill src={"/images/output/thumb/" + imgsrc} sizes="(max-width: 60px) 100vw" alt={""} />}
        </>
    )
}