'use client'

import { useEffect } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { animated, useSpring } from '@react-spring/web';
import Image from 'next/image';

const outputPath = process.env.NEXT_PUBLIC_OUTPUT_PATH as string;

export default function Output({
  origin, output
}: {
  origin: string
  output: string
}) {
  const fileName = output.split('/').pop();

  const [props1, api1] = useSpring(() => ({
    from: { display: 'none' },
    to: { display: 'block' },
    delay: 400
  }), []);

  const [props2, api2] = useSpring(() => ({
    from: { opacity: 0, y: 60 },
    to: { opacity: 1, y: 0 },
    delay: 400
  }), []);

  useEffect(() => {
    api1.start({ display: 'block', delay: 400 })
    api2.start({ opacity: 1, y: 0, delay: 400 })

    // 自动滚动到屏幕底边
    const timer = setTimeout(() => {
      const main = document.getElementById('main');
      if (main) {
        main.style.scrollBehavior = 'smooth'; // 滚动平滑的样式
        main.scrollTop = main.scrollHeight;
      }
    }, 600);

    return () => {
      clearTimeout(timer);
    }
  }, [api1, api2]);

  output = outputPath + output;

  return (
    <PhotoProvider>
      <PhotoView src={origin}></PhotoView>
      <animated.div style={props1} className="aspect-[16/9] overflow-hidden mb-8">
        <animated.div style={props2} className="diff aspect-[16/9] rounded-lg border border-input p-0.5 overflow-hidden">
          <div className="diff-item-1">
            <Image className='rounded-lg' alt="" src={output} width={500} height={500} priority style={{ width: "100cqi" }} />
          </div>
          <div className="diff-item-2">
            {origin && <Image className='rounded-lg' alt="" src={origin} width={500} height={500} priority style={{ width: "100cqi" }} />}
          </div>
          <div className="diff-resizer w-44 sm:w-60"></div>
          <a href={output} download={fileName} className="btn btn-info h-6 min-h-6 absolute top-3 right-4">保存</a>
          <PhotoView src={output}>
            <button className="btn btn-success h-6 min-h-6 absolute top-11 right-4">查看</button>
          </PhotoView>
        </animated.div>
      </animated.div>
    </PhotoProvider>
  )
}