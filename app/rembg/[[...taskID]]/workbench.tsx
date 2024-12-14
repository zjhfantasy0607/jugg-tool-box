'use client'

import clsx from "clsx"
import React, { useEffect, useState } from "react"
import toast from 'react-hot-toast'
import { selectUserinfo } from "@/store/slices/userinfoSlice"
import { useAppSelector } from "@/store/hook"
import { countPoints } from "@/app/lib/api"
import { RembgParams } from "@/app/lib/apiTypes"
import Upload from "@/app/ui/upload"
import path from 'path'

const MAX_FILE_SIZE_MB = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_FILE_SIZE_MB);

function Workbench({
  uploadCallback,
  submitCallback,
  inputImg,
  inputParams
}: {
  uploadCallback: () => void
  submitCallback: (params: RembgParams) => void
  inputImg: string
  inputParams: RembgParams
}) {
  const userInfo = useAppSelector(selectUserinfo);
  const [points, setPoints] = useState<number>(0);
  const [FormState, setFormState] = useState<RembgParams>(inputParams);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgbase64, setImgbase64] = useState<string>('');

  const handleChangeForm = (e: any) => {
    const { name, value } = e.target;

    if (name == "is_anime" || name == "return_mask") {
      setFormState(prevState => ({
        ...prevState,
        [name]: e.target.checked
      }));
      return;
    }

    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  // 上传图片后的处理
  function setFile(file: File) {
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
        const response = await countPoints(img.width, img.height, 1) // 计算需要消耗的点数
        if (response?.code == 200) {
          setPoints(response?.data?.points);
          setImgFile(file);
          setImgbase64(imgurl);
        }
      }
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

    await submitCallback({ ...FormState, input_image: imgbase64 })
  }

  // 抓取网络图片，放入上传栏
  async function fetchUrlImg(url: string) {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const fileName = path.basename(url)
      const file = new File([blob], fileName, { type: blob.type })
      setFile(file)
    } catch (error) {
      console.log(error)
    }
  }

  // 默认id存在展示原图情形
  useEffect(() => {
    if (inputImg) {
      fetchUrlImg(inputImg)
    }
  }, [])

  return (
    <div className="bg-card rounded-md border border-input p-6">
      {/* 图片上传区域 */}
      <div className="h-32 md:h-40">
        <Upload preview={imgbase64} file={imgFile} uploadCallback={(file) => { uploadCallback(); setFile(file) }} />
      </div>
      {/* 控件 */}
      <div className="space-y-5 mt-3">
        <div className="w-full flex">
          <label className="label">
            <span className="label-text">动漫图片 </span>
            <input type="checkbox" name="is_anime" checked={FormState.is_anime} className="checkbox checkbox-sm ml-1" onChange={handleChangeForm} />
          </label>
          <label className="label">
            <span className="label-text">返回蒙版 </span>
            <input type="checkbox" name="return_mask" checked={FormState.return_mask} className="checkbox checkbox-sm ml-1" onChange={handleChangeForm} />
          </label>
        </div>

      </div>

      {/* 提交按钮 */}
      <button onClick={handleSubmitImg} className="w-full btn btn-primary mt-5">
        <span>去除背景</span>
        <span className={clsx("flex items-center", { hidden: !imgFile })}>
          <span className="text-yellow-400 mr-0.5"> {points}</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-yellow-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
        </span>
      </button>
    </div>
  );
}

export default React.memo(Workbench)
