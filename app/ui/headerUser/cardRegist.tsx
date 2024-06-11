'use client'

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

import { CardProps } from "./loginButton"
import { regist } from '@/app/lib/actions';

export default function ({handleCards}: CardProps) {

    const [response, dispatch] = useFormState(regist, undefined);
    const formRef = useRef<HTMLFormElement>(null);  // 创建表单引用

    useEffect(() => {
        if (response) {
            if (response?.code == 200 && response?.data?.token) {
                toast.success('注册成功，已自动登录');
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
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">确认密码</span>
                </label>
                <input type="password" name="confirm_password" placeholder="确认密码" className="input input-bordered" required />
                <label className="label">
                    <span onClick={handleCards.showLogin} className="label-text-alt link link-hover">返回登录</span>
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
        <button type="submit" disabled={disabled} className="btn btn-primary">{disabled ? '注册中...' : '注册'}</button>
    );
}