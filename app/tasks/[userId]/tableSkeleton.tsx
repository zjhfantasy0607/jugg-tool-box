import './page.css'

export default function TableSkeleton({ len }: { len: number }) {
    const tr = Array.from({ length: len })
    return (
        <div className="table-background m-5 my-4 border-gray-300 rounded-md">
            <div className='overflow-x-auto mx-2'>
                <table className="table table-sm xl:table-md table-pin-rows table-pin-cols">
                    <thead>
                        <tr>
                            <th className='w-20 2xl:w-[137px]'>任务id</th>
                            <td>使用工具</td>
                            <td>消耗积分</td>
                            <td>创建时间</td>
                            <td>开始时间</td>
                            <td>结束时间</td>
                            <td>当前状态</td>
                            <td>预览图</td>
                            <th>查看</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tr.map((_, index) =>
                            <tr key={index} className='h-14 lg:h-16'>
                                <th className='w-20 2xl:w-[137px] flex justify-center'><div className="skeleton w-16 h-8"></div></th>
                                <td className="min-w-36"><div className="skeleton h-8 w-full"></div></td>
                                <td><div className="skeleton h-8 w-full"></div></td>
                                <td className="min-w-36"><div className="skeleton h-8 w-full"></div></td>
                                <td className="min-w-36"><div className="skeleton h-8 w-full"></div></td>
                                <td className="min-w-36"><div className="skeleton h-8 w-full"></div></td>
                                <td><div className="skeleton h-8 w-full"></div></td>
                                <td className='w-20'><div className="skeleton h-8 w-full"></div></td>
                                <th className="w-10"><div className="skeleton h-8 w-full"></div></th>
                            </tr>)}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>任务id</th>
                            <td>使用工具</td>
                            <td>消耗积分</td>
                            <td>创建时间</td>
                            <td>开始时间</td>
                            <td>结束时间</td>
                            <td>当前状态</td>
                            <td>预览图</td>
                            <th>查看</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}

