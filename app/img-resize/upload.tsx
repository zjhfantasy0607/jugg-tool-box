'use client'

import clsx from "clsx";
import { useState } from "react";
import { imgResize } from "@/app/lib/api";
import toast from 'react-hot-toast';

export default function Upload() {

  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgBase64, setImgBase64] = useState<string>('');
  const [imgResolution, setImgResolution] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
  const [resizeNum, setResizeNum] = useState<string>("2");
  const resizeNums = [1, 1.5, 2, 2.5, 3];

  const MAX_FILE_SIZE_MB = 2;

  console.log(imgBase64)

  function setFile(file: File) {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`文件大小不能超过${MAX_FILE_SIZE_MB}mb`);
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const img = new Image();
      const imgUrl = reader.result as string;
      img.onload = () => { // 获取图片分辨率
        setImgFile(file);
        setImgBase64(imgUrl);
        setImgResolution({ width: img.width, height: img.height });
      };
      img.src = imgUrl;
    };
    reader.readAsDataURL(file);
  }

  // 点击上传
  function handleClickUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
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

  // 拖动上传 松开鼠标
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  // 放大比例修改
  function handleResizeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setResizeNum(e.target.value)
  }

  // 生成按钮
  async function handleSubmitImg() {
    const response = await imgResize(imgBase64, resizeNum);
    console.log(response)
  }

  const uploadAreaStyle = {
    backgroundImage: `url(${imgBase64})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }

  return (
    <div className="flex justify-center px-5">
      <div className="w-[32rem] mt-5 bg-card rounded-lg border border-input p-6">
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
        <button onClick={handleSubmitImg} className="w-full btn btn-primary mt-12">生成高清图片</button>
      </div>
    </div>
  );
}
