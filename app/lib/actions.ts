'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { fetchGet, fetchPost } from './fetch'
import { cookies } from 'next/headers'

export async function regist(
    prevState: string | undefined,
    formData: FormData,
) {
    // 过滤formData中的数据
    const formDataFilter = new FormData();
    formDataFilter.append('email', formData.get('email') as string);
    formDataFilter.append('password', formData.get('password') as string);
    formDataFilter.append('confirm_password', formData.get('confirm_password') as string);

    if (formData.get('password') !== formData.get('confirm_password')) {
        return {code: 4220, msg: '两次输入的密码不相等'};
    }

    const response = await fetchPost('api/auth/regist', formDataFilter);
    
    // 成功设置cookie
    if (response?.code == 200 && response?.data?.token) {
        cookies().set({
            name: 'token',
            value: response.data.token,
            httpOnly: true,
            path: '/',
            maxAge: 3600 * 24 * 5 // cookeie 5天后过期
        })

        // 清空 token 值不返回给前端
        response.data.token = 'none';
    }

    // 请求登录接口
    return response;
}

export async function signIn(
    prevState: string | undefined,
    formData: FormData,
) {
    // 过滤formData中的数据
    const formDataFilter = new FormData();
    formDataFilter.append('email', formData.get('email') as string);
    formDataFilter.append('password', formData.get('password') as string);

    const response = await fetchPost('api/auth/signIn', formDataFilter);
    
    // 成功设置cookie
    if (response?.code == 200 && response?.data?.token) {
        cookies().set({
            name: 'token',
            value: response.data.token,
            httpOnly: true,
            path: '/',
            maxAge: 3600 * 24 * 5 // cookeie 5天后过期
        })

        // 清空 token 值不返回给前端
        response.data.token = 'none';
    }

    // 请求登录接口
    return response;
}

export async function signOut() {
    cookies().delete('token')
    
    // 请求登录接口
    return {code: 200, msg: "退出成功"};
}

export async function userInfoData() {
    noStore();
    const token = "Bearer " + (cookies().get('token')?.value || '');

    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    const response = await fetchPost('api/auth/info', null, {
        headers: myHeaders
    });
    
    // 请求登录接口
    return response;
}