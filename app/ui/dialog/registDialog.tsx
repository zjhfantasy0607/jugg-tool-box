'use client'

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import { regist } from '@/app/lib/actions';
import { sendEmailCode } from '@/app/lib/api';

import { useAppSelector, useAppDispatch, useToggleDialog } from '@/store/hook';
import { setUserinfo } from '@/store/slices/userinfoSlice';
import { setDialogType, selectCaptchaToken, setCaptchaToken } from '@/store/slices/dialogSlice';

export default function () {
    const reduxDispatch = useAppDispatch();
    const toogleDialog = useToggleDialog();

    const captchaToken = useAppSelector(state => selectCaptchaToken(state, "regist")) || ''

    const [email, setEmail] = useState<string>('');
    const [isDisabled, setIsDisabled] = useState<number>(0);
    const [response, dispatch] = useFormState(regist, undefined);

    const formRef = useRef<HTMLFormElement>(null);  // 创建表单引用
    const captcahFrom = useRef<string>('');  // 记录人机验证触发起来的位置

    useEffect(() => {
        if (!response) return
        if (response?.code == 200 && response?.data?.token) {
            toast.success('注册成功，已自动登录')
            // 设置登录后的用户信息状态
            const userinfo = response.data.userifo
            reduxDispatch((setUserinfo(userinfo)))
            // 重置登录卡片
            formRef?.current?.reset() // 重置表单状态
            toogleDialog() // 关闭注册窗口
        } else {
            // 人机验证失败时重置人机验证状态
            if (response.msg === '验证码错误') {
                reduxDispatch(setCaptchaToken({ key: 'regist', val: '' }))
            }
            toast.error(response?.msg)
        }

    }, [response])

    useEffect(() => {
        if (!captchaToken) return

        if (captcahFrom.current === 'sendCode') { // 人机验证成功后自动触发发送邮件
            callSendEmailCode(email, captchaToken)
        } else if (captcahFrom.current === 'submit') { // 人机验证成功后自动触发提交表单
            // 触发表单提交
            formRef?.current?.requestSubmit()
        }

        setTimeout( // 两分钟后token过期, 清除token
            () => reduxDispatch(setCaptchaToken({ key: 'regist', val: '' })),
            (1000 * 60 * 2)
        )
    }, [captchaToken])

    function handleChangeEmail(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        // 无人机验证token时，阻止表单默认提交行为，触发人机验证token
        if (!captchaToken) {
            event.preventDefault(); // 阻止表单默认提交行为
            // 进行人机验证
            captcahFrom.current = 'submit'
            reduxDispatch(setDialogType("captcha"))
        }
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
            callSendEmailCode(email, captchaToken)
        }
    }

    // 发送邮件
    async function callSendEmailCode(email: string, token: string) {
        // 发送验证码
        const resp = await sendEmailCode(email, token)
        // 禁用发送按钮
        disabledSendEmail(60)

        if (resp?.code == 200) {
            toast.success("已发送邮件")
        } else if (resp?.code) {
            toast.error(resp?.msg || "未知错误")
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

    return (
        <>
            <div>
                <form ref={formRef} action={dispatch} className="card-body" onSubmit={handleSubmit}>
                    <input type='hidden' name="captcha_token" value={captchaToken} />
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">邮箱</span>
                        </label>
                        <input type="email" name="email" value={email} onChange={handleChangeEmail} placeholder="输入邮箱" className="input input-bordered" maxLength={40} required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">密码</span>
                        </label>
                        <input type="password" name="password" placeholder="输入密码" className="input input-bordered" maxLength={40} required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">确认密码</span>
                        </label>
                        <input type="password" name="confirm_password" placeholder="确认密码" className="input input-bordered" maxLength={40} required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">邮箱验证</span>
                        </label>
                        <label className='flex justify-between'>
                            <input type="text" name="email_code" placeholder="邮箱验证码" className="input input-bordered w-[55%]" maxLength={6} />
                            <button type="button" disabled={isDisabled > 0} className="btn btn-primary w-[45%]" onClick={handleSendCode}>
                                {isDisabled > 0 ? `${isDisabled}s 后重试` : '发送验证码'}
                            </button>
                        </label>
                        <label className="label">
                            <span onClick={() => reduxDispatch(setDialogType("login"))} className="label-text-alt link link-hover">返回登录</span>
                            <span onClick={() => reduxDispatch(setDialogType("forget"))} className="label-text-alt link link-hover">忘记密码?</span>
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
        <button type="submit" disabled={disabled} className="btn btn-primary">{disabled ? '注册中...' : '注册'}</button>
    );
}