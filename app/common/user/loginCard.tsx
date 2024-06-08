'use client'

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

import { CardProps } from "./cardWrapper"
import { signIn } from '@/app/lib/actions';

export default function LoginCard({ handleCards }: CardProps) {

    const [response, dispatch] = useFormState(signIn, undefined);
    const formRef = useRef<HTMLFormElement>(null);  // 创建表单引用

    useEffect(() => {
        if (response) {
            if (response?.code == 200 && response?.data?.token) {
                toast.success('欢迎登录 ^_^');
                handleCards.hiddenCard(); // 关闭卡片
                formRef?.current?.reset(); // 重置表单状态
            } else {
                toast.error(response?.msg);
            }
        }
    }, [response]);

    return (
        <form ref={formRef} action={dispatch} className="card-body">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">邮箱</span>
                </label>
                <input type="email" name="email" placeholder="输入邮箱" className="input input-bordered" required />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">密码</span>
                </label>
                <input type="password" name="password" placeholder="输入密码" className="input input-bordered" required />
                <label className="label">
                    <span onClick={handleCards.showRegist} className="label-text-alt link link-hover">注册账号</span>
                    <span onClick={handleCards.showForget} className="label-text-alt link link-hover">忘记密码?</span>
                </label>
            </div>
            <div className="form-control mt-6">
                <SubmitButton />
            </div>
        </form>
    );
}

function SubmitButton({ disabled = false }: { disabled?: boolean }) {
    const { pending } = useFormStatus();
    disabled = disabled || pending

    return (
        <button type="submit" disabled={disabled} className="btn btn-primary">{disabled ? '登录中...' : '登录'}</button>
    );
}