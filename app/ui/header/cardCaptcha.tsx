'use client'

import SliderCaptcha from 'rc-slider-captcha';

import React from 'react';
import { getPuzzle, validPuzzle } from '@/app/lib/api';
import toast from 'react-hot-toast';

export default function ({
    email,
    success
}: {
    email: string
    success: (token: string) => void
}) {

    async function verifyCaptcha(data: any) {
        const x = Math.round(Number(data.x)) * 2;
        const response = await validPuzzle(email, x);

        if (response.code !== 200) {
            toast.error(response?.msg);
            return Promise.reject("error");
        }

        setTimeout(() => {
            success(response.data.token);
        }, 1000);

        return response;
    }

    return (
        <div className="card-body px-0">
            <div className='w-[272px] m-auto'>
                <SliderCaptcha
                    request={() => getPuzzle(email)}
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
