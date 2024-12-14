export default function TableSkeleton({ len }: { len: number }) {
    const tr = Array.from({ length: len })
    return (
        <div className="table-background m-5 my-2 border-gray-300 rounded-md">
            <div className='overflow-x-auto mx-2'>
                <table className="table table-sm xl:table-md table-pin-rows table-pin-cols">
                    <thead>
                        <tr>
                            <td>记录时间</td>
                            <td>积分记录</td>
                            <td>积分变化</td>
                        </tr>
                    </thead>
                    <tbody>
                        {tr.map((_, index) =>
                            <tr key={index}>
                                <td className="min-w-28">
                                    <div className="skeleton h-8 w-full"></div>
                                </td>
                                <td className="min-w-36">
                                    <div className="skeleton h-8 w-full"></div>
                                </td>
                                <td>
                                    <div className="skeleton h-8 w-full"></div>
                                </td>
                            </tr>)}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>记录时间</td>
                            <td>积分记录</td>
                            <td>积分变化</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}

