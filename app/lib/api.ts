'use server';

import { fetchGet, fetchPost } from './fetch';
import { cookies } from 'next/headers';
import createPuzzle from 'node-puzzle';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { promisify } from 'util';
import { GetRandomNumber } from '@/app/lib/utils';

const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

export async function sendEmailCode(email: string, captchaToken: string) {
    // 过滤formData中的数据
    const formDataFilter = new FormData();
    formDataFilter.append('email', email);
    formDataFilter.append('captcha_token', captchaToken);

    fetchPost('api/auth/send-email-code', formDataFilter);

    // 请求登录接口
    return { code: 200, msg: "发送成功" };
}

export async function getPuzzle(userEmail: string) {

    const random = GetRandomNumber(1, 14);
    const imgPath = path.join(process.cwd(), 'public', 'puzzle_img', 'source', `img (${random}).jpg`);

    const uniqueId = uuidv4(); // 生成一个UUID
    const bgFilePath = path.join(process.cwd(), 'public', 'puzzle_img', 'temp', `${uniqueId}.jpg`);
    const puzzleFilePath = path.join(process.cwd(), 'public', 'puzzle_img', 'temp', `${uniqueId}.png`);

    const bgStream = fs.createWriteStream(bgFilePath);
    const puzzleStream = fs.createWriteStream(puzzleFilePath);

    const res = await createPuzzle(imgPath, {
        bg: bgStream,
        puzzle: puzzleStream
    }, {
        width: 115,
        height: 115,
        borderWidth: 2,
        fillColor: 'rgba(255,255,255,0.7)'
    });

    // 过滤formData中的数据
    const formDataFilter = new FormData();
    formDataFilter.append('email', userEmail);
    formDataFilter.append('puzzleX', String(res.x));

    // 发送到服务器进行记录
    await fetchPost('api/auth/set-captcha', formDataFilter);

    console.log(res)

    // 读取文件并转换为Base64
    const bgBuffer = await readFile(bgFilePath);
    const puzzleBuffer = await readFile(puzzleFilePath);
    const bgBase64 = bgBuffer.toString('base64');
    const puzzleBase64 = puzzleBuffer.toString('base64');

    // 删除生成的验证码拼图
    await unlink(bgFilePath);
    await unlink(puzzleFilePath);

    return {
        bgUrl: `data:image/jpeg;base64,${bgBase64}`,
        puzzleUrl: `data:image/png;base64,${puzzleBase64}`
    };
}

export async function validPuzzle(userEmail: string, puzzleX: number) {

    // 过滤formData中的数据
    const formDataFilter = new FormData();
    formDataFilter.append('email', userEmail);
    formDataFilter.append('puzzleX', String(puzzleX));

    // 发送到服务器进行记录
    return await fetchPost('api/auth/validate-captcha', formDataFilter);
}

export async function imgResize(imgBase64: string, resize: string) {
    // 过滤formData中的数据
    const formData = new FormData();
    formData.append('imgBase64', imgBase64);
    formData.append('resize', resize);

    let token = cookies().get('token')?.value || '';

    if (token == '') {
        return null;
    }

    token = "Bearer " + token;

    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    const response = await fetchPost('api/img/resize', formData, {
        headers: myHeaders
    });

    return response;
}
