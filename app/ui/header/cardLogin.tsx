'use client'

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

import { CardProps } from "./user"
import { signIn } from '@/app/lib/actions';
import CaptchaCard from "./cardCaptcha";

export default function ({ handleCards }: CardProps) {

    const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
    const [captchaToken, setCaptchaToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [response, dispatch] = useFormState(signIn, undefined);

    const formRef = useRef<HTMLFormElement>(null);  // 创建表单引用

    useEffect(() => {
        if (response) {
            if (response?.code == 200 && response?.data?.token) {
                toast.success('欢迎登录 ^_^');

                // 重置登录卡片相关状态
                setCaptchaToken('');
                formRef?.current?.reset(); // 重置表单状态
                handleCards.hiddenCard(); // 关闭卡片
            } else {
                // 人机验证失败时重置验证码状态
                if (response.msg === '人机验证失败') {
                    setCaptchaToken('');
                }
                toast.error(response?.msg);
            }
        }
    }, [response]);

    function handleShowCaptcha(isShow: boolean) {
        setShowCaptcha(isShow);

        // 为卡片全局添加关闭前事件 
        if (isShow) {
            handleCards.beforeHiddenCard = () => {
                setShowCaptcha(false);
                return false;
            }
        } else {
            handleCards.beforeHiddenCard = () => true;
        }
    }

    function handleChangeEmail(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        // 无token时
        if (!captchaToken) {
            event.preventDefault(); // 阻止表单默认提交行为
            // 进行人机验证
            handleShowCaptcha(true);
        }
    }

    function captchaSuccess(token: string) {
        // 关闭验证码的显示
        handleShowCaptcha(false);
        setCaptchaToken(token);

        // 触发表单提交
        setTimeout(() => {
            formRef?.current?.requestSubmit();
        }, 100);

        // 两分钟后清除token
        setTimeout(() => {
            setCaptchaToken('');
        }, (1000 * 60 * 2));
    }

    return (
        <>
            <div className={clsx({ "hidden": showCaptcha })}>
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
                        <label className="label">
                            <span onClick={handleCards.showRegist} className="label-text-alt link link-hover">注册账号</span>
                            <span onClick={handleCards.showForget} className="label-text-alt link link-hover">忘记密码?</span>
                        </label>
                    </div>
                    <div className="form-control mt-6">
                        <SubmitButton />
                    </div>
                </form>
            </div>

            {showCaptcha && <CaptchaCard email={email} success={captchaSuccess} />}
        </>
    );
}

function SubmitButton({ disabled = false }: { disabled?: boolean }) {
    const { pending } = useFormStatus();
    disabled = disabled || pending

    return (
        <button type="submit" disabled={disabled} className="btn btn-primary">{disabled ? '登录中...' : '登录'}</button>
    );
}