'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Pagination({
    page,
    total,
    len,
    buttonNum
}: {
    page: number
    total: number
    len: number
    buttonNum: number
}) {
    const pathname = usePathname();

    if (buttonNum < 6) { // 保持按钮数量最小为 6
        buttonNum = 6
    }

    // 计算按钮的范围
    const half = Math.floor(buttonNum / 2);
    const totalPage = Math.ceil(total / len);
    let startPage = 1;
    let endPage = totalPage;

    // 调整开始和结束页以保持 buttonNum 数量
    if (totalPage > buttonNum) {
        if (page >= 4) {
            if (buttonNum % 2) { // 偶数需要砍掉一个左边的按钮
                startPage = Math.max(1, page - half + 2);
            } else {
                startPage = Math.max(1, page - half + 3);
            }
            endPage = Math.min(totalPage, page + half - 2);
        } else {
            endPage = Math.min(totalPage, buttonNum - 2);
        }

        if (page > totalPage - half) {
            startPage = totalPage - buttonNum + 3
        }
    }

    const pages = [];
    if (startPage > 1 && totalPage > buttonNum) {
        pages.push(1);
        if (startPage > 2) {
            if (page == half + (buttonNum % 2 ? 1 : 0)) { // 有时会出现 1,...,3,4 这样省略了也和无省略一样的场景，此处做修复
                pages.push(2)
            } else {
                pages.push("...");
            }
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    if (endPage < totalPage && totalPage > buttonNum) {
        if (endPage < totalPage - 1) {
            if (page == totalPage - half) { // 有时会出现 1,...,3,4 这样省略了也和无省略一样的场景，此处做修复
                pages.push(totalPage - 1)
            } else {
                pages.push("..."); // 省略号
            }
        }
        pages.push(totalPage); // 结束页
    }

    function buildUrl(targetPage: number) {
        const pathWithoutPage = pathname.replace(/\/\d+$/, '');
        return targetPage === 1 ? pathWithoutPage : `${pathWithoutPage}/${targetPage}`;
    }

    return (
        <div className="flex justify-center join">
            {page === 1 && <button className="join-item btn btn-sm md:btn-md">«</button>}
            {page !== 1 && <Link className="join-item btn btn-sm md:btn-md" href={buildUrl(page - 1)}>«</Link>}

            {pages.map((p, index) => {
                if (p === "...") {
                    return <button type="button" key={index} className="join-item btn btn-disabled btn-sm md:btn-md">...</button>
                }
                if (p === page) {
                    return <button type="button" key={index} className="join-item btn btn-sm md:btn-md btn-active">{page}</button>
                }
                return <Link key={index} className='join-item btn btn-sm md:btn-md' href={buildUrl(Number(p))}>{p}</Link>
            })}

            {page === totalPage && <button className="join-item btn btn-sm md:btn-md">»</button>}
            {page !== totalPage && <Link className="join-item btn btn-sm md:btn-md" href={buildUrl(page + 1)}>»</Link>}
        </div>
    );
}