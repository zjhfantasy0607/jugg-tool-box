import { createAppSlice } from "@/store/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit";
import { getProgress } from '@/app/lib/api'
import { RootState } from '@/store/store'
import { TokenToken } from '@/app/lib/api'

export type TaskStatus = 'pending' | 'producing' | 'success' | 'failed' | 'remove';

export interface Task {
    status: TaskStatus;
    progress: number;
    rank: number;
    endtime: string;
    output: string;
    params: string;
}

export interface Tasks {
    [key: string]: Task;
}

interface TaskState {
    isEnd: boolean;
    tasks: Tasks;
    totalRank: number;
}

const initTaskState: TaskState = {
    isEnd: true,
    tasks: {},
    totalRank: 0
}

let isConn = false;

export const progressSlice = createAppSlice({
    name: 'progress',
    initialState: initTaskState,
    reducers: (create) => ({
        progressStart: create.asyncThunk(
            async (_, { getState, dispatch }) => {

                if (isConn) {
                    return
                } else {
                    isConn = true
                }

                const token = await TokenToken();
                const url = process.env.NEXT_PUBLIC_PROGRESS_WEBSOCKET as string;
                const ws = new WebSocket(url, []);

                ws.onopen = () => {
                    ws.send(token); // 发送用户token进行身份验证
                };

                ws.onmessage = (event) => {
                    const message = JSON.parse(event.data);
                    if (message.isEnd) { // 所有进度查询完毕关闭链接
                        ws.close();
                    }
                    dispatch(updateTask(message));
                };

                ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                };

                ws.onclose = () => {
                    isConn = false;
                };

                // 返回一个标志，告诉 Redux 连接已建立
                return 'WebSocket connected';
            },
        ),
        updateTask: create.reducer((state, action: PayloadAction<TaskState>) => {
            state.isEnd = action.payload.isEnd;
            state.totalRank = action.payload.totalRank;

            Object.entries(action.payload.tasks).forEach(([taskId, task]) => {
                // 如果任务不存在，创建新任务
                if (!state.tasks[taskId]) {
                    state.tasks[taskId] = {
                        status: 'pending',
                        progress: 0,
                        rank: 0,
                        endtime: '',
                        output: '',
                        params: ''
                    };
                }

                const stateTask = state.tasks[taskId];

                // 只有在特定状态下才更新
                if (!['success', 'failed', 'remove'].includes(stateTask.status)) {
                    // 直接赋值，immer 会处理不可变性
                    state.tasks[taskId] = {
                        ...stateTask,
                        status: task.status,
                        rank: task.rank,
                        endtime: task.endtime,
                        output: task.output,
                        params: task.params,
                        progress: task.progress > stateTask.progress ? task.progress : stateTask.progress
                    };
                }
            });
        })
    }),
    selectors: {
        selectIsEnd: (progress) => progress.isEnd,
        selectTotalRank: (progress) => progress.totalRank,
        selectTasks: (progress) => progress.tasks,
        selectTask: (progress, taskID: string) => progress.tasks[taskID] || null,
    },
})

export const { progressStart, updateTask } = progressSlice.actions

export const {
    selectIsEnd,
    selectTasks,
    selectTotalRank,
    selectTask
} = progressSlice.selectors;

