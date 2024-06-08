'use client'

import { CardProps } from "./cardWrapper"

export default function forgetCard({handleCards}: CardProps) {
    return (
        <form className="card-body">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">邮箱</span>
                </label>
                <input type="email" placeholder="输入邮箱" className="input input-bordered" required />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">新密码</span>
                </label>
                <input type="password" placeholder="输入新密码" className="input input-bordered" required />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">确认密码</span>
                </label>
                <input type="password" placeholder="确认密码" className="input input-bordered" required />
                <label className="label">
                    <span onClick={handleCards.showLogin} className="label-text-alt link link-hover">前往登录</span>
                    <span onClick={handleCards.showRegist} className="label-text-alt link link-hover">前往注册</span>
                </label>
            </div>
            <div className="form-control mt-6">
                <button className="btn btn-primary">修改密码</button>
            </div>
        </form>
    );
}
