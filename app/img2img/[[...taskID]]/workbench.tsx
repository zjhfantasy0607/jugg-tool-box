'use client'

import { Img2imgParams, isValidKey } from "@/app/lib/apiTypes";
import { useState, useRef, useEffect, useCallback } from "react";
import { selectUserinfo } from "@/store/slices/userinfoSlice";
import { useAppSelector } from "@/store/hook";
import toast from "react-hot-toast";
import { countPoints } from "@/app/lib/api";
import Upload from "@/app/ui/upload"
import { useDebouncedCallback } from 'use-debounce';
import { FetchImg } from "@/app/lib/utils";

const MAX_FILE_SIZE_MB = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_FILE_SIZE_MB);
const uploadPath = process.env.NEXT_PUBLIC_UPLOAD_PATH as string;

export default function Workbench({
    uploadCallback,
    submitCallback,
    inputParams,
    inputImg
}: {
    uploadCallback: () => void
    submitCallback: (config: Img2imgParams) => void
    inputParams: Img2imgParams,
    inputImg: string
}) {
    const userInfo = useAppSelector(selectUserinfo);
    const formRef = useRef<HTMLFormElement>(null);

    const [points, setPoints] = useState<number>(0);
    const [FormState, setFormState] = useState<Img2imgParams>(inputParams);
    const [imgbase64, setImgbase64] = useState<string>('');
    const [imgFile, setImgFile] = useState<File | null>(null);

    const handleChangeForm = (e: any) => {
        const { name, value } = e.target;

        // 修改积分相关数值，更新消耗的积分显示
        if (name == 'width' || name == 'height' || name == 'prompt') {
            updatePoints();
        }

        setFormState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleRestForm = (key: string = '') => {
        const def: Img2imgParams = {
            width: 896,
            height: 1152,
            prompt: '',
            negative_prompt: '',
            seed: -1,
            input_image: ''
        };

        if (!key) {
            setFormState(def);
            return;
        }

        if (isValidKey(key, def)) {
            setFormState(prevState => ({
                ...prevState,
                [key]: def[key]
            }));
        }
    }

    const handleSubmit = async () => {
        if (!userInfo.email) {
            toast.error("请先登录")
            return
        }
        await submitCallback({ ...FormState, input_image: imgbase64 });
    }

    const updatePoints = useDebouncedCallback(async () => {
        const pointsMagnification: number = Math.floor(FormState.prompt.length * 0.008) + 1;
        const response = await countPoints(FormState.width, FormState.height, pointsMagnification) // 计算需要消耗的点数
        if (response?.code == 200) {
            setPoints(response?.data?.points)
        }
    }, 600);

    const setFile = useCallback((file: File) => {
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
                    // 使用函数更新来更新FormState，避免使用外部的FormState
                    setFormState((prevState) => ({
                        ...prevState,
                        width: img.width,
                        height: img.height,
                    }));
                }
            }
        }
    }, []);

    // 默认id存在展示原图情形
    useEffect(() => {
        if (!inputImg) {
            return
        }
        (async () => {
            const file = await FetchImg(uploadPath + inputImg);
            if (file) {
                setFile(file);
            }
        })()
    }, [inputImg, setFile]);

    useEffect(() => {
        setFormState(inputParams);
        updatePoints();
    }, [inputParams, updatePoints])

    return (
        <div className="w-full flex justify-center transition-all duration-300 my-5 bg-white">
            <form ref={formRef} id="txt2img-form" className="w-full bg-card rounded-md border border-input p-6 pt-3 flex flex-col md:flex-row md:space-x-4">
                <div className="flex-1 space-y-3">
                    <div className="form-control ">
                        <label className="label">
                            <span className="label-text text-md">提示词</span>
                        </label>
                        <textarea
                            value={FormState.prompt}
                            onChange={handleChangeForm}
                            name="prompt"
                            className="bg-gray-100 rounded-xs px-2 py-1 placeholder-gray-500 textarea textarea-bordered h-24 leading-tight"
                            placeholder="输入提示词..."></textarea>
                    </div>

                    <div className="form-control ">
                        <label className="label">
                            <span className="label-text text-md">上传图片</span>
                        </label>
                        <div className="h-24 md:h-32">
                            <Upload preview={imgbase64} file={imgFile} uploadCallback={(file) => { uploadCallback(); setFile(file) }} />
                        </div>
                    </div>

                    <div className="form-control ">
                        <div className="label flex justify-between">
                            <span className="label-text text-md">宽度</span>
                            <div className="flex items-center">
                                <div className="cursor-pointer mr-2" onClick={() => { handleRestForm("width") }} title="重置">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </div>
                                <input type="text" name="width" onChange={handleChangeForm} value={FormState.width} className="input input-bordered w-20 h-6 rounded text-center text-sm" />
                            </div>
                        </div>
                        <input type="range" onChange={handleChangeForm} min={1} max="2048" value={FormState.width} className="range range-xs" name="width" />
                    </div>
                    <div className="form-control ">
                        <div className="label flex justify-between">
                            <span className="label-text text-md">高度</span>
                            <div className="flex items-center">
                                <div className="cursor-pointer mr-2" onClick={() => { handleRestForm("height") }} title="重置">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </div>
                                <input type="text" name="height" onChange={handleChangeForm} className="input input-bordered w-20 h-6 rounded text-center text-sm" value={FormState.height} />
                            </div>
                        </div>
                        <input type="range" onChange={handleChangeForm} min={1} max="2048" value={FormState.height} className="range range-xs" name="height" />
                    </div>
                    <div className="form-control relative">
                        <label className="label">
                            <span className="label-text text-md">随机数种子</span>
                            <span className="text-xs text-info">*值为-1时表示随机数</span>
                        </label>
                        <input type="number" name="seed" className="input input-bordered" onChange={handleChangeForm} value={FormState.seed} />
                        <div className="absolute right-8 bottom-3 cursor-pointer" onClick={() => { handleRestForm("seed") }} title="重置">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </div>
                    </div>
                    <div className="form-control flex flex-row space-x-3">
                        <button onClick={() => { handleRestForm() }} type="button" className="flex-[1] btn hover:bg-transparent bg-transparent border-gray-300 flex items-center">重置</button>
                        <button onClick={handleSubmit} type="button" className="flex-[2] btn btn-primary">
                            <span className="flex items-center">
                                <span>生成</span>
                                <span className="text-yellow-400 ml-1 mr-0.5"> {points}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-yellow-400">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}