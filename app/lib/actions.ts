'use server';

import { fetchPost } from './fetch';
import { cookies } from 'next/headers';
import { Token } from './serverUtils';

export async function regist(
    prevState: string | undefined,
    formData: FormData,
) {
    // 过滤formData中的数据
    const formDataFilter = new FormData();
    formDataFilter.append('email', formData.get('email') as string);
    formDataFilter.append('password', formData.get('password') as string);
    formDataFilter.append('confirm_password', formData.get('confirm_password') as string);
    formDataFilter.append('captcha_token', formData.get('captcha_token') as string);
    formDataFilter.append('email_code', formData.get('email_code') as string);

    if (formData.get('password') !== formData.get('confirm_password')) {
        return { code: 4220, msg: '两次输入的密码不相等' };
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
    formDataFilter.append('captcha_token', formData.get('captcha_token') as string);

    const response = await fetchPost('api/auth/sign-in', formDataFilter);

    // 成功设置cookie
    if (response?.code == 200 && response?.data?.token) {
        const cookiesTime = 3600 * 24 * 5 // cookeie 5天后过期

        cookies().set({
            name: 'token',
            value: response.data.token,
            httpOnly: true,
            path: '/',
            maxAge: cookiesTime
        })

        cookies().set({
            name: 'uid',
            value: response.data?.userinfo?.uid,
            httpOnly: true,
            path: '/',
            maxAge: cookiesTime
        })

        cookies().set({
            name: 'email',
            value: response.data?.userinfo?.email,
            httpOnly: true,
            path: '/',
            maxAge: cookiesTime
        })
        // 清空 token 值不进行返回
        response.data.token = 'none'
    }

    // 请求登录接口
    return response
}

export async function changePassword(
    prevState: string | undefined,
    formData: FormData,
) {

    const token = Token();
    if (!token) {
        return null;
    }

    const Bearer = "Bearer " + token;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", Bearer);

    // 过滤formData中的数据
    const formDataFilter = new FormData();
    formDataFilter.append('old_password', formData.get('old_password') as string);
    formDataFilter.append('password', formData.get('password') as string);
    formDataFilter.append('confirm_password', formData.get('confirm_password') as string);
    formDataFilter.append('captcha_token', formData.get('captcha_token') as string);
    formDataFilter.append('email_code', formData.get('email_code') as string);

    if (formData.get('password') !== formData.get('confirm_password')) {
        return { code: 4220, msg: '两次输入的密码不相等' };
    }

    const response = await fetchPost('api/auth/change-password', formDataFilter, {
        headers: myHeaders
    });

    // 请求登录接口
    return response;
}

export async function signOut() {
    cookies().delete('token')

    // 请求登录接口
    return { code: 200, msg: "退出成功" };
}