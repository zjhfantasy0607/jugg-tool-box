'use client'

import React, { useEffect, useRef } from 'react'
import Link from "next/link"
import toast from 'react-hot-toast'
import { useAppSelector, useAppDispatch } from "@/store/hook"
import { selectTasks, Task as ProgressTask, TaskStatus } from "@/store/slices/progressSlice"
import Image from 'next/image'

export default function Table({
    tableData
}: {
    tableData: Task[]
}) {
    const progresses = useAppSelector(selectTasks);

    return (
        <div className="table-background m-5 my-4 border-gray-300 rounded-md">
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
                            <th>查看</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map(item => {
                            const progress = progresses[item.task_id] || null;
                            return <Tr key={item.task_id} task={item} progress={progress} />
                        })}
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
                            <th>查看</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}

export interface Task {
    id: number
    task_id: string
    uid: string
    used_points: number
    tool: string
    tool_title: string
    tool_url: string
    output: string
    status: TaskStatus
    start_time: string
    end_time: string
    created_at: string
    updated_at: string
}

const Tr = React.memo(({
    task,
    progress
}: {
    task: Task
    progress: ProgressTask | null
}) => {
    const endtime = progress?.endtime || task.end_time; // 任务完成时间

    let status = task.status;
    if (progress) {
        status = progress.status;
    }

    // 任务输出图片
    let output = progress?.output || task.output;
    output = JSON.parse(output)[0] || '';
    output = output.replace(/\\/g, '/');

    // 任务进度百分比
    let progressNum = Math.ceil((progress?.progress || 0) * 100)
    // - 进度默认会在1%的时候卡顿一会，影响体验，故修改为 0
    if (progressNum == 1) {
        progressNum = 0
    }

    const getStatusLabel = (status: TaskStatus, progressNum: number) => {
        switch (status) {
            case 'success':
                return <span className="text-green-500">完成</span>;
            case 'failed':
                return <span className="text-error">失败</span>;
            case 'pending':
                return <span className="text-warning">排队中</span>;
            case 'producing':
                return <span className="text-info">{progressNum}%</span>;
            default:
                return null;
        }
    }

    return (
        <tr>
            <th>
                <div className="w-14 m-0 tooltip tooltip-right mytooltip" data-tip={task.task_id} onClick={HandleTooltip}>
                    <button className="w-full cursor-pointer truncate">{task.task_id}</button>
                </div>
            </th>
            <td className="min-w-36">{task.tool_title}</td>
            <td>{task.used_points}</td>
            <td className="min-w-36">{task.created_at}</td>
            <td className="min-w-36">{task.start_time}</td>
            <td className="min-w-36">{endtime === '0001-01-01 00:00:00' ? '' : endtime}</td>
            <td>
                {getStatusLabel(status, progressNum)}
            </td>
            <td className='w-20 h-14 lg:h-16 !px-2 !py-1'>
                <div className='w-full h-full relative overflow-hidden'>
                    {output && <Image className='m-auto object-contain' fill priority src={"/images/output/thumb/" + output} sizes="(max-width: 60px) 100vw" alt={""} />}
                </div>
            </td>
            <th className="w-10">
                <Link className='flex justify-center items-center' title='查看' href={`${task.tool_url}/${task.task_id}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </Link>
            </th>
        </tr>
    )
})

const HandleTooltip = async (e: React.MouseEvent<HTMLDivElement>) => {
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