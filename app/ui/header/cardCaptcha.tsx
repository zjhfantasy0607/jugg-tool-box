'use client'

import SliderCaptcha from 'rc-slider-captcha';

import React from 'react';
import { CardProps } from "./user";
import { getPuzzle, validPuzzle } from '@/app/lib/captcha';
import toast from 'react-hot-toast';

export default function ({ handleCards }: CardProps) {

    async function verifyCaptcha (data: any) {
        const x = Math.round(Number(data.x)) * 2;
        const response = await validPuzzle(handleCards.getUserEmail(), x);

        console.log(response);
        console.log(x)
        console.log(data.x);

        if (response.code !== 200) {
            toast.error(response?.msg);
            return Promise.reject("error");
        }
        
        return response;
    }

    return (
        <div className="card-body">
            <SliderCaptcha
                request={() => getPuzzle(handleCards.getUserEmail())}
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
    );
}
