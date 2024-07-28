'use client'

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import clsx from 'clsx';

import { CardProps } from "./user"
import { regist } from '@/app/lib/actions';
import { sendEmailCode } from '@/app/lib/api';
import CaptchaCard from "./cardCaptcha";

export default function ({ handleCards }: CardProps) {

    const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
    const [captchaToken, setCaptchaToken] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [isDisabled, setIsDisabled] = useState<number>(0);

    const [response, dispatch] = useFormState(regist, undefined);
    const formRef = useRef<HTMLFormElement>(null);  // 创建表单引用
    const captcahFrom = useRef<string>('');  // 记录人机验证触发起来的位置

    useEffect(() => {
        if (response) {
            if (response?.code == 200 && response?.data?.token) {
                toast.success('注册成功，已自动登录');
                handleCards.hiddenCard(); // 关闭卡片
                formRef?.current?.reset(); // 重置表单状态
            } else {
                // 人机验证失败时重置验证码状态
                if (response.msg === '人机验证失败') {
                    setCaptchaToken('');
                }
                console.log(response)
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
            captcahFrom.current = 'submit';
            handleShowCaptcha(true);
        }
    }

    // 人机验证成功回调
    function captchaSuccess(token: string) {
        // 关闭验证码的显示
        handleShowCaptcha(false);
        setCaptchaToken(token);

        // 两分钟后清除token
        setTimeout(() => {
            setCaptchaToken('');
        }, (1000 * 60 * 2));

        // 人机验证成功后自动触发发送邮件
        if (captcahFrom.current === 'sendCode') {
            callSendEmailCode(email, token);
        } else if (captcahFrom.current === 'submit') {
            // 触发表单提交
            setTimeout(() => {
                formRef?.current?.requestSubmit();
            }, 100);
        }
    }

    // 发送邮箱验证码
    function handleSendCode() {
        // 触发表单校验
        formRef?.current?.reportValidity();

        if (!captchaToken) {
            captcahFrom.current = 'sendCode';
            handleShowCaptcha(true);
        } else {
            callSendEmailCode(email, captchaToken);
        }
    }

    // 发送邮件
    function callSendEmailCode(email: string, token: string) {
        // 发送验证码
        sendEmailCode(email, token);
        // 禁用发送按钮
        setDisabledInterval(60);
    }

    // 设置发送邮箱验证码为禁用
    function setDisabledInterval(time: number) {
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
                            <span onClick={handleCards.showLogin} className="label-text-alt link link-hover">返回登录</span>
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
        <button type="submit" disabled={disabled} className="btn btn-primary">{disabled ? '注册中...' : '注册'}</button>
    );
}