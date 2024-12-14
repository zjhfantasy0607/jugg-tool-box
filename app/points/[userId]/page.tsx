import './page.css'
import TableWraper from "./tableWraper"

export default function Tasks({ params }: { params: { userId: string[] } }) {
    return (
        <div>
            <h2 className="ml-5 mt-4 text-primary lg:text-lg font-bold">积分记录</h2>
            <TableWraper />
        </div>
    )
}