'use server';

import { fetchPost } from './fetch'
import { cookies } from 'next/headers'
import createPuzzle from 'node-puzzle'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { promisify } from 'util'
import { GetRandomNumber } from '@/app/lib/utils'
import { unstable_noStore as noStore } from 'next/cache'
// import { revalidatePath } from 'next/cache'

const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

function Token() {
    return cookies().get('token')?.value || '';
}

export async function sendEmailCode(email: string, captchaToken: string) {
    // 过滤formData中的数据
    const formDataFilter = new FormData();
    formDataFilter.append('email', email);
    formDataFilter.append('captcha_token', captchaToken);

    fetchPost('api/auth/send-email-code', formDataFilter);

    // 请求登录接口
    return { code: 200, msg: "发送成功" };
}

export async function getPuzzle(browserId: string) {
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
    formDataFilter.append('browser_id', browserId);
    formDataFilter.append('puzzle_x', String(res.x));

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

export async function validPuzzle(browserId: string, puzzleX: number) {
    // 过滤formData中的数据
    const formDataFilter = new FormData();
    formDataFilter.append('browser_id', browserId);
    formDataFilter.append('puzzle_x', String(puzzleX));

    // 发送到服务器进行记录
    return await fetchPost('api/auth/validate-captcha', formDataFilter);
}

export async function getUserInfoData() {
    noStore()
    
    const token = Token();
    if (!token) {
        return null;
    }
    
    const Bearer = "Bearer " + token;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", Bearer);

    const response = await fetchPost('api/auth/info', null, {
        headers: myHeaders
    });
    
    if (response.code !== 200) {
        return null
    }

    return response.data.user;
}

export async function getToolsTree() {
    return await fetchPost('api/tools/tree');
}

export async function getToolsSearch(search: string) {
    noStore()

    const formData = new FormData();
    formData.append('search', search);

    return await fetchPost('api/tools/search', formData);
}

export async function getPoints(width: number, height: number, num: number) {
    noStore()
    const formData = new FormData();
    formData.append('width', width.toString());
    formData.append('height', height.toString());
    formData.append('num', num.toString());

    return await fetchPost('api/img/points', formData);
}

export async function imgResize(imgBase64: string, resize: string) {
    // 过滤formData中的数据
    const formData = new FormData();
    formData.append('imgBase64', imgBase64);
    formData.append('resize', resize);

    const token = Token();
    if (!token) {
        return null;
    }
    
    const Bearer = "Bearer " + token;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", Bearer);

    const response = await fetchPost('api/img/resize', formData, {
        headers: myHeaders
    });

    return response;
}

export async function getProgress() {
    noStore()

    const token = Token();
    if (!token) {
        return null;
    }

    const Bearer = "Bearer " + token;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", Bearer);

    const response = await fetchPost('api/img/progress', null, {
        headers: myHeaders
    });

    // const uid =  cookies().get('uid')?.value || ''
    // const path = '/task/' + uid
    // revalidatePath(path)

    return response;
}

export async function getTask(taskId: string) {
    noStore()

    const formData = new FormData();
    formData.append('task_id', taskId);
    // 刷新 tasks 页面的任务状态
    const response = await fetchPost('api/tasks/task', formData)

    return response;
}

export async function getTasks(offset: number, limit: number) {
    noStore()

    const token = Token()
    if (!token) {
        return null
    }
    
    const Bearer = "Bearer " + token
    const myHeaders = new Headers()
    myHeaders.append("Authorization", Bearer)

    const formData = new FormData();
    formData.append('offset', offset.toString())
    formData.append('limit', limit.toString())

    const response = await fetchPost('api/tasks', formData, {
        headers: myHeaders,
    })

    let tasks = []
    if (response?.code == 200 && response?.data?.tasks?.length > 0) {
        tasks = response.data
    }

    // await new Promise(resolve => setTimeout(resolve, 3000))

    return tasks
}
