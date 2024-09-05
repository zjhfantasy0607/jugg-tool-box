'use client'

import clsx from "clsx"
import React, { useEffect, useState } from "react"
import toast from 'react-hot-toast'
import { selectUserinfo } from "@/store/slices/userinfoSlice"
import { useAppSelector } from "@/store/hook"
import { getPoints } from "@/app/lib/api"
import path from 'path'

function Upload({
  uploadCallback,
  submitCallback,
  origin,
  inputParams
}: {
  uploadCallback: (imgbase64: string) => void
  submitCallback: (imgbase64: string, resize: string) => void
  origin: string
  inputParams: { resize: string }
}) {
  const MAX_FILE_SIZE_MB = 2

  const userInfo = useAppSelector(selectUserinfo)
  const [imgFile, setImgFile] = useState<File | null>(null)
  const [imgResolution, setImgResolution] = useState<{ width: number, height: number }>({ width: 0, height: 0 })
  const [imgbase64, setImgbase64] = useState<string>('')
  const [points, setPoints] = useState<number>(0)
  const [resizeNum, setResizeNum] = useState<string>("2")
  const resizeNums = [1, 1.5, 2, 2.5, 3]

  // 上传图片后的处理
  function setFile(file: File, isInit: boolean = false) {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`文件大小不能超过${MAX_FILE_SIZE_MB}mb`)
      return;
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      const img = new Image()
      const imgurl = reader.result as string
      img.src = imgurl
      img.onload = async () => { // 加载图片获取分辨率
        setImgFile(file)
        setImgbase64(imgurl)
        setImgResolution({ width: img.width, height: img.height })

        let resize = Number(resizeNum)
        if (isInit) { // 从之前的任务参数之填入参数
          setResizeNum(inputParams.resize)
          resize =  Number(inputParams.resize)
        } else {
          uploadCallback(imgurl)
        }

        const response = await getPoints(img.width * resize, img.height * resize, 1) // 获取需要消耗的点数
        if (response?.code == 200) {
          setPoints(response?.data?.points)
        }
      }
    }
  }

  // 点击上传
  function handleClickUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  // 拖动上传
  function handleDropUpload(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  }

  // 拖动上传 松开鼠标事件
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  // 图片比例修改
  async function handleResizeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setResizeNum(e.target.value)
    const resize = Number(e.target.value)
    const response = await getPoints(imgResolution.width * resize, imgResolution.height * resize, 1) // 获取需要消耗的点数

    if (response?.code == 200) {
      setPoints(response?.data?.points)
    }
  }

  // 生成按钮点击
  async function handleSubmitImg() {
    if (!userInfo.email) {
      toast.error("请先登录")
      return
    }

    if (!imgbase64) {
      toast.error("上传图片为空")
      return
    }

    if (!(imgbase64.indexOf("data:image/") === 0)) {
      toast.error("上传图片载入中，请等待或重新上传图片")
      return
    }

    await submitCallback(imgbase64, resizeNum)
  }

  // 抓取网络图片上传
  async function fetchUrlImg(url: string) {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const fileName = path.basename(url)
      const file = new File([blob], fileName, { type: blob.type })
      setFile(file, true)
    } catch (error) {
      console.log(error)
    }
  }

  // 默认id存在展示原图情形
  useEffect(() => {
    if (!imgbase64 && origin) {
      fetchUrlImg(origin)
    }
  }, [origin])

  const uploadAreaStyle = {
    backgroundImage: `url(${imgbase64})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }

  return (
    <div className="flex justify-center my-5 px-5 transition-all duration-300">
      <div className="w-[32rem] bg-card rounded-lg border border-input p-6">
        {/* 图片上传区域 */}
        <div
          style={uploadAreaStyle}
          className="relative flex items-center justify-center h-32 border-2 border-dashed border-muted rounded-md cursor-pointer transition-colors hover:border-primary"
          onDrop={handleDropUpload}
          onDragOver={handleDragOver}
        >
          <input type="file" className="absolute w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleClickUpload} />
          <div className="text-center space-y-1 text-muted-foreground flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={clsx("size-6", { hidden: imgFile })}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            <p className={clsx("text-primary", { hidden: imgFile })}>将图片拖拽到此处</p>
            <p className={clsx("text-gray-500 text-xs", { hidden: imgFile })}>或点击此区域选择文件上传</p>
            <p className={clsx("text-gray-500 text-xs absolute top-[-26px]", { hidden: !imgFile })}>{imgFile?.name}</p>
          </div>
        </div>
        {/* 控件 */}
        <div className="space-y-5">
          <div className="w-full">
            <label className="label">
              <span className="label-text">放大比例：</span>
            </label>
            <div className="w-full">
              <input type="range" min={1} max={3} value={resizeNum} onChange={handleResizeChange} className="range range-xs" step="0.5" />
              <div className="flex w-full justify-between px-2 text-xs">
                {resizeNums.map(item =>
                  <span className="relative" key={item}>
                    <div className="absolute text-center inset-0 w-[100px] transform translate-x-[-48%] translate-y-[100%]">
                      <span className="w-[45%] inline-block text-right">{(imgResolution.width * item).toFixed(0)}</span>
                      *
                      <span className="w-[45%] inline-block text-left">{(imgResolution.height * item).toFixed(0)}</span>
                    </div>
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* 提交按钮 */}
        <button onClick={handleSubmitImg} className="w-full btn btn-primary mt-8">
          <span>生成高清图片</span>
          <span className={clsx("flex items-center", { hidden: !imgFile })}>
            <span className="text-yellow-400 mr-0.5"> {points}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-yellow-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}

export default React.memo(Upload)
