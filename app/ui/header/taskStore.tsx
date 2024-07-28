'use client'

export default function TaskStore() {
    return (
        <div className="flex justify-center px-5">
            <div className="w-[32rem] mt-5 m-auto bg-card rounded-lg border border-input py-2 px-6">
                <div className="flex justify-between">
                    <span className="text-sm">排队等待生成中...</span>
                    <span className="text-sm">165 / 8</span>
                </div>
                <div>
                    <progress className="progress"></progress>
                </div>
            </div>
        </div>
    );
}