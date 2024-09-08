import TableWraper from "./tableWraper"

export default function Tasks({ params }: { params: { userId: string[] } }) {
    // const page = Number(params.userId[1]) || 1
    return (
        <div>
            <h2 className="ml-5 mt-4 text-primary lg:text-lg font-bold">任务记录</h2>
            <TableWraper />
        </div>
    )
}