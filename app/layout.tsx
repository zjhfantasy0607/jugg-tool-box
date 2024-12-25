import { Toaster } from 'react-hot-toast';
import StoreProvider from "./StoreProvider";
import "@/styles/globals.css";
import 'react-photo-view/dist/react-photo-view.css';
import Header from "@/app/ui/header"
import ToolList from "./ui/header/toolList"
import { getUserInfoData } from "@/app/lib/api";
import { headers } from 'next/headers';
import { getSeo } from '@/app/lib/api';

// 从数据库设置元数据
export async function generateMetadata({ params }: { params: any }) {
  // 获取 headers
  const headersList = headers();
  const fullUrl = headersList.get('x-url') || "";
  let pathname = new URL(fullUrl).pathname;

  let title = ''
  if (pathname == '/') {
    pathname = '/home'
  } else {
    title = ' | JUGG工具箱';
  }
  const seo = await getSeo(pathname);

  if (seo.code == 200) {
    title = seo.data.seo.title + title;
    return {
      title: title,
      keywords: seo.data.seo.keywords,
      description: seo.data.seo.description,
    }
  } else {
    return {
      title: '404 | JUGG工具箱',
      keywords: '',
      description: '',
    }
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 获取用户数据
  const userInfoData = await getUserInfoData();

  return (
    <html data-theme="lofi" lang="zh">
      <body>
        <StoreProvider userinfo={userInfoData}>
          <Toaster />
          <div className="drawer lg:drawer-open overflow-hidden">
            <input id="jugg-global-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-side border-r z-20 lg:z-0">
              <label htmlFor="jugg-global-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
              <ToolList />
            </div>

            <div className="drawer-content items-center bg-primary-content h-svh overflow-hidden relative flex flex-col">
              {/* Page content here */}
              <Header />
              <main id="main" className="relative z-1 w-full h-full overflow-y-auto bg-[#f9f9f9] flex flex-col justify-between">
                {children}
                <footer className="pb-5">
                  <p className="text-gray-400 text-sm text-center">© 2024 jugg-tool-box</p>
                </footer>
              </main>
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
