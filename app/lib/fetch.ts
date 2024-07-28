
const API_HOST: string = process.env.API_HOST as string;

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
}

export const fetchDefault = async (uri: string, options: FetchOptions = {}): Promise<any> => {
    const url = `${API_HOST}${uri}`;

    const defaultOptions: FetchOptions = {
        ...options,
    };

    try {
        const response = await fetch(url, defaultOptions);
        return response.json();
    } catch (error: any) {
        if (error.name == 'TypeError' && error.message == 'fetch failed') {
            return { code: -1, msg: '服务器连接失败，请检查网络', data: null };
        } else {
            return JSON.parse(error.message);
        }
    }
};

export const fetchGet = (uri: string, options: FetchOptions = {}): Promise<any> => {
    return fetchDefault(uri, { ...options, method: 'GET' });
};

export const fetchPost = (
    uri: string, 
    formData: FormData | null = new FormData(),
    options: FetchOptions = {}
): Promise<any> => {
    return fetchDefault(uri, {
        ...options,
        method: "POST",
        body: formData,
        redirect: "follow"
    });
};