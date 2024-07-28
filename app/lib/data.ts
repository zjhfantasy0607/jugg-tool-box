'use server';

import { fetchGet, fetchPost } from './fetch';
import { unstable_noStore as noStore } from 'next/cache';

export async function getUserInfoData(token: string) {
    noStore();

    if (token == '') {
        return null;
    }

    token = "Bearer " + token;

    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);

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
    noStore();

    const formData = new FormData();
    formData.append('search', search);

    return await fetchPost('api/tools/search', formData);
}