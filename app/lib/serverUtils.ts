import { cookies } from 'next/headers'

export function Token() {
    return cookies().get('token')?.value || '';
}