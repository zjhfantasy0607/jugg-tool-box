import './page.css'

export default function TableSkeleton() {
    const tr = Array.from({ length: 5 })
    return (
        <div className="table-background m-5 border border-gray-300 rounded-md">
            <div className='overflow-x-auto mx-2'>
                <table className="table table-sm xl:table-md table-pin-rows table-pin-cols">
                    <thead>
                        <tr>
                            <th>任务id</th>
                            <td>使用工具</td>
                            <td>消耗积分</td>
                            <td>创建时间</td>
                            <td>开始时间</td>
                            <td>结束时间</td>
                            <td>当前状态</td>
                            <td>预览图</td>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tr.map((_, index) =>
                            <tr key={index}>
                                <th><div className="skeleton h-8 w-full"></div></th>
                                <td className="min-w-36"><div className="skeleton h-8 w-full"></div></td>
                                <td><div className="skeleton h-8 w-full"></div></td>
                                <td className="min-w-36"><div className="skeleton h-8 w-full"></div></td>
                                <td className="min-w-36"><div className="skeleton h-8 w-full"></div></td>
                                <td className="min-w-36"><div className="skeleton h-8 w-full"></div></td>
                                <td><div className="skeleton h-8 w-full"></div></td>
                                <td><div className="skeleton h-8 w-full"></div></td>
                                <th className="min-w-14"><div className="skeleton h-8 w-full"></div></th>
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
                            <th>操作</th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}

