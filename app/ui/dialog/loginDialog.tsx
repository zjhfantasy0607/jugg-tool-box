'use client'

import { useFormState, useFormStatus } from 'react-dom';
import { use, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { signIn } from '@/app/lib/actions';

import { useAppSelector, useAppDispatch } from '@/store/hook';
import { setDialogType, selectCaptchaToken, setCaptchaToken } from '@/store/slices/dialogSlice';
import { setUserinfo } from '@/store/slices/userinfoSlice';
import { toggleIsShow } from '@/store/slices/dialogSlice';

export default function LoginDialog() {
    const reduxDispatch = useAppDispatch();

    const captcahFrom = useRef<string>('');  // 记录人机验证触发起来的位置
    const captchaToken = useAppSelector(state => selectCaptchaToken(state, "login")) || '';
    const [response, dispatch] = useFormState(signIn, undefined);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (!response) return
        if (response?.code == 200 && response?.data?.token) {
            toast.success('欢迎登录 ^_^')
            // 更新全局用户信息
            const userinfo = response.data.userinfo
            reduxDispatch((setUserinfo(userinfo)))
            // 重置登录卡片
            formRef?.current?.reset() // 重置表单状态
            reduxDispatch(toggleIsShow()) // 关闭登录窗口
            // 检查任务队列
        } else {
            // 人机验证失败时重置验证码token
            if (response?.msg === '验证码错误') {
                // 清除当前token
                reduxDispatch(setCaptchaToken({ key: 'login', val: '' }))
            }
            toast.error(response?.msg)
        }
    }, [response, reduxDispatch])

    useEffect(() => {
        // 人机验证完成后自动提交
        if (!captchaToken) return
        if (captcahFrom.current == 'login') {
            formRef?.current?.requestSubmit() // 提交表单
            setTimeout( // 两分钟后token过期, 清除token
                () => reduxDispatch(setCaptchaToken({ key: 'login', val: '' })),
                (1000 * 60 * 2)
            )
        }
    }, [captchaToken, reduxDispatch])

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        // 无人机验证token时，阻止表单默认提交行为，触发人机验证token
        if (!captchaToken) {
            event.preventDefault()
            captcahFrom.current = 'login'
            reduxDispatch(setDialogType("captcha"))
        }
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
                        <input type="email" name="email" placeholder="输入邮箱" className="input input-bordered" maxLength={40} required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">密码</span>
                        </label>
                        <input type="password" name="password" placeholder="输入密码" className="input input-bordered" maxLength={40} required />
                        <label className="label">
                            <span onClick={() => reduxDispatch(setDialogType("regist"))} className="label-text-alt link link-hover">注册账号</span>
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
    const { pending } = useFormStatus()
    disabled = disabled || pending
    return (
        <button type="submit" disabled={disabled} className="btn btn-primary">{disabled ? '登录中...' : '登录'}</button>
    );
}