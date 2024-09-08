import { createAppSlice } from "@/store/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit";
import { getProgress } from '@/app/lib/api'
import { RootState } from '@/store/store'

const PROGRESS_REQUEST_INTERVAL = 1500;

export type TaskStatus = 'pending' | 'producing' | 'success' | 'failed';

export interface Task {
    status: TaskStatus;
    progress: number;
    rank: number;
}

export interface Tasks {
    [key: string]: Task;
}

type Status = "idle" | "loading" | 'failed';

interface TaskState {
    isEnd: boolean;
    status: Status;
    tasks: Tasks;
    totalRank: number;
}

const initTaskState: TaskState = {
    isEnd: true,
    status: "idle",
    tasks: {},
    totalRank: 0
}

export const progressSlice = createAppSlice({
    name: 'progress',
    initialState: initTaskState,
    reducers: (create) => ({
        progressStatus: create.reducer((state, action: PayloadAction<Status>) => {
            state.status = action.payload;
        }),
        removeTask: create.reducer((state, action: PayloadAction<string>) => {
            if (state.tasks.hasOwnProperty(action.payload)) {
                delete state.tasks[action.payload];
            }
        }),
        progressUp: create.asyncThunk(
            async (_, { getState, dispatch }) => {
                // 当前有请求在执行，停止当前请求
                const state = (getState() as RootState).progress;
                if (state.status == 'loading') {
                    return null
                }
                
                // 设置当前请求状态并发送请求
                dispatch(progressStatus("loading"))
                try {
                    const response = await getProgress();

                    // 继续下一轮 progress 请求
                    if (!response?.data?.isEnd && response.code != -1) {
                        setTimeout(() => dispatch(progressUp()), PROGRESS_REQUEST_INTERVAL);
                    }

                    // 后端的队列在任务完成后会自动弹出队列不再返回给前端，
                    // 这里为了让任务进程组件给用户更好的体验将因为间隔无法读取到 100% 的任务调整到 100% 后再延时从队列删除
                    for (const taskID in state.tasks) {
                        if (!response.data.tasks.hasOwnProperty(taskID) && state.tasks[taskID].progress <= 1) {
                            response.data.tasks[taskID] = {
                                status: "producing",
                                progress: 1,
                                rank: 0
                            }
                            setTimeout(() => dispatch(removeTask(taskID)), 500)
                        }
                    }

                    return response.data;
                } catch (error) {
                    // 客户端无网络时错误尝试重连
                    setTimeout(() => dispatch(progressUp()), PROGRESS_REQUEST_INTERVAL);
                }
            },
            {
                pending: (state) => {

                },
                fulfilled: (state, action) => {
                    state.status = "idle";

                    if (!action.payload) {
                        return
                    }

                    state.isEnd = action.payload.isEnd;
                    state.totalRank = action.payload.totalRank;

                    // 同步响应中的队列
                    for (const taskID in action.payload.tasks) {

                        const task = action.payload.tasks[taskID]

                        if (!state.tasks.hasOwnProperty(taskID)) {
                            state.tasks[taskID] = { status: 'pending', progress: 0, rank: 0 };
                        }

                        const stateTask = state.tasks[taskID];

                        // 进程进度需大于之前的进度才覆盖
                        if (task.progress > stateTask.progress) {
                            stateTask.progress = task.progress;
                        }
                        stateTask.status = task.status;
                        stateTask.rank = task.rank;
                    }
                },
                rejected: (state) => {
                    state.status = 'failed';
                },
            },
        )
    }),
    selectors: {
        selectIsEnd: (progress) => progress.isEnd,
        selectStatus: (progress) => progress.status,
        selectTotalRank: (progress) => progress.totalRank,
        selectTasks: (progress) => progress.tasks,
        selectTask: (progress, taskID: string) => progress.tasks[taskID] || null,
    },
})

export const { progressUp, progressStatus, removeTask } = progressSlice.actions

export const {
    selectIsEnd,
    selectStatus,
    selectTasks,
    selectTotalRank,
    selectTask
} = progressSlice.selectors;

