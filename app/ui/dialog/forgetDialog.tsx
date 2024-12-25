'use client'

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { changePassword } from '@/app/lib/actions';
import { sendEmailCode } from '@/app/lib/api';
import { useAppSelector, useAppDispatch, useToggleDialog } from '@/store/hook';
import { selectUserinfo } from '@/store/slices/userinfoSlice';
import { setDialogType, selectCaptchaToken, setCaptchaToken } from '@/store/slices/dialogSlice';
import { toggleIsShow } from '@/store/slices/dialogSlice';

export default function ForgetDialog() {
    const reduxDispatch = useAppDispatch();

    const captchaToken = useAppSelector(state => selectCaptchaToken(state, "forget")) || '';
    const userInfo = useAppSelector(selectUserinfo);

    const [isDisabled, setIsDisabled] = useState<number>(0);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [response, dispatch] = useFormState(changePassword, undefined);

    const formRef = useRef<HTMLFormElement>(null);  // 创建表单引用
    const captcahFrom = useRef<string>('');  // 记录人机验证触发起来的位置

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        // 无人机验证token时，阻止表单默认提交行为，触发人机验证token
        if (!captchaToken) {
            event.preventDefault(); // 阻止表单默认提交行为
            // 进行人机验证
            captcahFrom.current = 'submit'
            reduxDispatch(setDialogType("captcha"))
        }
    }

    // 设置发送邮箱验证码为禁用
    function disabledSendEmail(time: number) {
        setIsDisabled(time);
        const timer = setInterval(() => {
            setIsDisabled(prevIsDisabled => {
                if (prevIsDisabled <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prevIsDisabled - 1;
            });
        }, 1000);
    }

    // 发送邮箱验证码
    function handleSendCode() {
        // 触发表单校验
        if (!formRef?.current?.reportValidity()) {
            return
        }

        if (!captchaToken) { //没有人机验证触发人机验证
            captcahFrom.current = 'sendCode'
            reduxDispatch(setDialogType("captcha"))
        } else {
            if (userInfo) {
                callSendEmailCode(userInfo.email, captchaToken);
            } else {
                toast.error("用户信息已过期");
            }
        }
    }

    // 发送邮件
    const callSendEmailCode = useCallback(async (email: string, token: string) => {
        //请求前禁用发送按钮
        setIsSending(true);
        // 发送验证码
        const resp = await sendEmailCode(email, token)
        // 禁用发送按钮
        disabledSendEmail(60);
        setIsSending(false);

        if (resp?.code == 200) {
            toast.success("已发送邮件")
        } else if (resp?.code) {
            toast.error(resp?.msg || "未知错误")
        }
    }, []);

    useEffect(() => {
        if (!response) return
        if (response?.code == 200) {
            toast.success('修改成功')
            formRef?.current?.reset() // 重置表单状态
            reduxDispatch(toggleIsShow()); // 关闭登录窗口
        } else {
            // 人机验证失败时重置人机验证状态
            if (response.msg === '验证码错误') {
                reduxDispatch(setCaptchaToken({ key: 'forget', val: '' }))
            }
            toast.error(response?.msg)
        }

    }, [response, reduxDispatch])

    useEffect(() => {
        if (!captchaToken) return

        if (captcahFrom.current === 'sendCode') { // 人机验证成功后自动触发发送邮件
            if (userInfo) {
                callSendEmailCode(userInfo.email, captchaToken)
            } else {
                toast.error("用户信息已过期");
            }
        } else if (captcahFrom.current === 'submit') { // 人机验证成功后自动触发提交表单
            // 触发表单提交
            formRef?.current?.requestSubmit()
        }

        setTimeout( // 两分钟后token过期, 清除token
            () => reduxDispatch(setCaptchaToken({ key: 'forget', val: '' })),
            (1000 * 60 * 2)
        )
    }, [captchaToken, callSendEmailCode, reduxDispatch, userInfo]);

    return (
        <>
            <div>
                <form ref={formRef} action={dispatch} className="card-body" onSubmit={handleSubmit}>
                    <input type='hidden' name="captcha_token" value={captchaToken} />
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">旧密码</span>
                        </label>
                        <input type="password" name="old_password" placeholder="输入密码" className="input input-bordered" maxLength={40} required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">新密码</span>
                        </label>
                        <input type="password" name="password" placeholder="输入密码" className="input input-bordered" maxLength={40} required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">确认新密码</span>
                        </label>
                        <input type="password" name="confirm_password" placeholder="确认密码" className="input input-bordered" maxLength={40} required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">邮箱验证</span>
                        </label>
                        <label className='flex justify-between'>
                            <input type="text" name="email_code" placeholder="邮箱验证码" className="input input-bordered w-[55%]" maxLength={6} />
                            <button type="button" disabled={isDisabled > 0 || isSending} className="btn btn-primary w-[45%]" onClick={handleSendCode}>
                                {isSending ? '发送中...' : isDisabled > 0 ? `${isDisabled}s 后重试` : '发送验证码'}
                            </button>
                        </label>
                    </div>
                    <div className="form-control mt-6">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </>
    );
}

function SubmitButton({ disabled = false }: { disabled?: boolean }) {
    const { pending } = useFormStatus();
    disabled = disabled || pending

    return (
        <button type="submit" disabled={disabled} className="btn btn-primary">{disabled ? '提交中...' : '确认修改'}</button>
    );
}