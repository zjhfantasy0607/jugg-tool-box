'use client'

import clsx from "clsx"
import React, { useState } from "react"

export default function Upload({
    preview,
    file,
    uploadCallback
}:{
    preview: string
    file: File | null
    uploadCallback: (file: File) => void
}) {
    // 点击上传
    function handleClickUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            uploadCallback(selectedFile)
        }
    }

    // 拖动上传
    function handleDropUpload(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            uploadCallback(droppedFile)
        }
    }

    // 拖动上传 松开鼠标事件
    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    const uploadAreaStyle = {
        backgroundImage: `url(${preview})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
    }

    return (
        <div
            style={uploadAreaStyle}
            className="relative flex items-center justify-center h-full border-2 border-dashed border-muted rounded-md cursor-pointer transition-colors hover:border-primary"
            onDrop={handleDropUpload}
            onDragOver={handleDragOver}
        >
            <input type="file" className="absolute w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleClickUpload} />
            <div className="text-center space-y-1 text-muted-foreground flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={clsx("size-7 text-[#71717a]", { hidden: preview })}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                <p className={clsx("text-[#71717a]", { hidden: preview })}>将图片拖拽到此处</p>
                <p className={clsx("text-[#71717a] text-xs", { hidden: preview })}>或点击此区域选择文件上传</p>
                <p className={clsx("text-[#71717a] text-xs absolute top-[-26px]", { hidden: !file })}>{file?.name}</p>
            </div>
        </div>
    )
}