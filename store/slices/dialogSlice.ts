import { createAppSlice } from "@/store/createAppSlice"
import type { PayloadAction } from "@reduxjs/toolkit"

type DialogType = "login" | "regist" | "forget" | "captcha"

interface CaptchaToken {
    [key: string]: string
}

interface CaptchaPayload {
    key: string
    val: string
}

interface DialogState {
    show: boolean
    dialogType: DialogType
    prevDialogType: DialogType
    captchaToken: CaptchaToken
}

const initState: DialogState = {
    show: false,
    dialogType: 'login',
    prevDialogType: 'login',
    captchaToken: {}
}

export const dialogSlice = createAppSlice({
    name: 'dialogSlice',
    initialState: initState,
    reducers: (create) => ({
        toggleIsShow: create.reducer((state) => {
            // 关闭前执行关闭前事件
            if (state.show) {
                if (state.dialogType == "captcha") {
                    state.dialogType = state.prevDialogType
                } else {
                    state.show = false
                }
            } else {
                state.show = true
            }
        }),
        setDialogType: create.reducer((state, action: PayloadAction<DialogType>) => {
            state.prevDialogType = state.dialogType
            state.dialogType = action.payload
        }),
        setCaptchaToken: create.reducer((state, action: PayloadAction<CaptchaPayload>) => {
            state.captchaToken[action.payload.key] = action.payload.val
        }),
    }),
    selectors: {
        selectShow: (dialog) => dialog.show,
        selectDialogType: (dialog) => dialog.dialogType,
        selectPrevDialogType: (dialog) => dialog.prevDialogType,
        selectCaptchaToken: (dialog, form: string) => dialog.captchaToken[form] || null,
    },
})

export const { toggleIsShow, setDialogType, setCaptchaToken } = dialogSlice.actions

export const { selectShow, selectDialogType, selectCaptchaToken, selectPrevDialogType } = dialogSlice.selectors

