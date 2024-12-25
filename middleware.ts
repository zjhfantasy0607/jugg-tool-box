import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // 在header中增加当前url
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-url', request.url);
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        }
    });
}

// See "Matching Paths" below to learn more
export const config = {

}