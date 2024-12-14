import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { fetchPost } from '@/app/lib/fetch';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const form = new FormData();
          form.append('email', credentials.email as string);
          form.append('password', credentials.password as string);
          form.append('captcha_token', credentials.captcha_token as string);
          const response = await fetchPost('api/auth/sign-in', form);

          if (response?.code == 200 && response?.data) {
            return {
              ...response.data.userInfo,
              token: response.data.token
            }
          } else {
            // throw new Error(response?.msg || "未知错误");
            // throw new Error("Invalid credentials.");
            return {};
          }
        }
        // throw new Error("Invalid credentials.");
        return {};
      },
    }),
  ],
  // JWT configuration for session management
  // jwt: {
  //   secret: process.env.NEXTAUTH_SECRET,
  //   maxAge: 30 * 24 * 60 * 60, // 30 days
  // },
});