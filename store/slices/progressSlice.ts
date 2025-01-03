import { createAppSlice } from "@/store/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit";
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
                    // dispatch(updateIsEnd(false));
                    isConn = true;
                }

                const token = await TokenToken();
                const url = process.env.NEXT_PUBLIC_PROGRESS_WEBSOCKET as string;
                const ws = new WebSocket(url, []);

                ws.onopen = () => {
                    ws.send(token); // 发送用户token进行身份验证
                };

                ws.onmessage = (event) => {
                    const message = JSON.parse(event.data);

                    dispatch(updateIsEnd(message.isEnd));
                    dispatch(updateTotalRank(message.totalRank));
                    Object.entries(message.tasks as Record<string, Task>).forEach(([taskId, task]) => {
                        dispatch(updateTask({ taskId, task }));
                        if (task.status == "success" || task.status == "failed") {
                            setTimeout(() => {
                                dispatch(deleteTask(taskId));
                            }, 10000)
                        }
                    });
                };

                ws.onerror = (error) => {
                    console.log(error)
                };

                ws.onclose = () => {
                    isConn = false;
                };

                // 返回一个标志，告诉 Redux 连接已建立
                return 'WebSocket connected';
            },
        ),
        updateIsEnd: create.reducer((state, action: PayloadAction<boolean>) => {
            state.isEnd = action.payload;
        }),
        updateTotalRank: create.reducer((state, action: PayloadAction<number>) => {
            state.totalRank = action.payload;
        }),
        updateTask: create.reducer((state, action: PayloadAction<{ taskId: string, task: Task }>) => {
            // 不在以下状态才更新
            if (!state.tasks[action.payload.taskId]) {
                state.tasks[action.payload.taskId] = action.payload.task;
                return
            }

            if (!['success', 'failed', 'remove'].includes(state.tasks[action.payload.taskId].status)) {
                const progress = state.tasks[action.payload.taskId].progress
                state.tasks[action.payload.taskId] = action.payload.task;
                if (progress > action.payload.task.progress) { // 当原先的进度比现在的要大时，不更新进度
                    state.tasks[action.payload.taskId].progress = progress
                }
            }
        }),
        deleteTask: create.reducer((state, action: PayloadAction<string>) => {
            delete state.tasks[action.payload];
        })
    }),
    selectors: {
        selectIsEnd: (progress) => progress.isEnd,
        selectTotalRank: (progress) => progress.totalRank,
        selectTasks: (progress) => progress.tasks,
        selectTask: (progress, taskID: string) => progress.tasks[taskID] || null,
    },
})

export const { progressStart, updateTask, updateIsEnd, updateTotalRank, deleteTask } = progressSlice.actions

export const {
    selectIsEnd,
    selectTasks,
    selectTotalRank,
    selectTask
} = progressSlice.selectors;

