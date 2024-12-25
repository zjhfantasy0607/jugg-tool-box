'use client'

import React from 'react';
import SliderCaptcha from 'rc-slider-captcha';
import { getPuzzle, validPuzzle } from '@/app/lib/api';
import toast from 'react-hot-toast';
import { useAppSelector, useAppDispatch, useToggleDialog } from '@/store/hook';
import { selectBrowserId } from '@/store/slices/userinfoSlice';
import { selectPrevDialogType, setCaptchaToken } from '@/store/slices/dialogSlice';

export default function CaptchaDialog() {

    const toogleDialog = useToggleDialog()
    const dispatch = useAppDispatch()

    const browserId = useAppSelector(selectBrowserId)
    const from = useAppSelector(selectPrevDialogType)

    async function verifyCaptcha(data: any) {
        const x = Math.round(Number(data.x)) * 2;
        const response = await validPuzzle(browserId, x);
        if (response.code !== 200) {
            toast.error(response?.msg);
            return Promise.reject("error");
        }

        // toast.success("验证成功")
        
        setTimeout(() => {
            toogleDialog() // 关闭验证码弹窗
            dispatch(setCaptchaToken({key: from, val: response.data.token})) // 设置token
        }, 1000)

        return response
    }

    return (
        <div className="card-body px-0">
            <div className='w-[272px] m-auto'>
                <SliderCaptcha
                    request={() => getPuzzle(browserId)}
                    onVerify={verifyCaptcha}
                    bgSize={{ width: 272, height: 136 }}
                    tipText={{
                        default: '向右拖动完成拼图',
                        loading: '加载中...',
                        moving: '向右拖动至拼图位置',
                        verifying: '验证中...',
                        error: '验证失败',
                        errors: '图片加载失败',
                    }}
                    loadingBoxProps={{
                        text: "图片加载中..."
                    }}
                />
            </div>
        </div>
    );
}
