import './page.css';
import TableWraper from "./tableWraper";
import { Token } from "@/app/lib/serverUtils"
import { notFound } from 'next/navigation';

export default function Points({ params }: { params: { userId: string[] } }) {
    // 获取用户token判断当前是否为登录状态
    const token = Token();

    if (!token) {
        notFound();
    }

    return (
        <div>
            <h2 className="ml-5 mt-4 text-primary lg:text-lg font-bold">积分记录</h2>
            <TableWraper />
        </div>
    )
}