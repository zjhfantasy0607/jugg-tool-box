'use client'

import clsx from 'clsx';

import LoginDialog from "@/app/ui/dialog/loginDialog";
import RegistDialog from "@/app/ui/dialog/registDialog";
import ForgetDialog from "@/app/ui/dialog/forgetDialog";
import CaptchaDialog from "@/app/ui/dialog/captchaDialog";

import { useAppSelector, useToggleDialog } from "@/store/hook";
import { selectShow, selectDialogType } from "@/store/slices/dialogSlice";

export default function Dialog() {
    const toogleDialog = useToggleDialog()
    
    const dialogType = useAppSelector(selectDialogType)
    const dialogShow = useAppSelector(selectShow)

    return (
        <dialog id="login_modal" className={clsx("modal", { 'modal-open': dialogShow })} onClick={toogleDialog}>
            <div className="modal-box card shrink-0 max-w-sm shadow-2xl bg-base-100" onClick={e => e.stopPropagation()}>
                {/* 为了保存表单数据状态不进行卸载操作，默认隐藏 */}
                <div className={clsx({ "hidden": dialogType !== 'login' })}><LoginDialog /></div>
                <div className={clsx({ "hidden": dialogType !== 'regist' })}><RegistDialog /></div>
                <div className={clsx({ "hidden": dialogType !== 'forget' })}><ForgetDialog /></div>
                {/* 验证码组件装载就会加载默认验证图耗时巨大 */}
                {dialogType === 'captcha' && <CaptchaDialog />}
            </div>
        </dialog>
    )
}