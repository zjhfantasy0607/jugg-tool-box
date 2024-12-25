'use client'

import { useEffect, useRef } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { animated, useSpring } from '@react-spring/web';
import Image from 'next/image';

const outputPath = process.env.NEXT_PUBLIC_OUTPUT_PATH as string;

export default function Output({
  output
}: {
  output: string
}) {
  const viewButtonRef = useRef<HTMLButtonElement>(null);
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
      <animated.div style={props1} className="aspect-[16/8] overflow-hidden mb-8">
        <animated.div style={props2} className="relative aspect-[16/8] rounded-lg border border-input p-0.5 bg-gray-50">
          <Image className='rounded-lg w-full h-full object-contain cursor-pointer' onClick={() => viewButtonRef.current?.click()} alt="" src={output} priority width={500} height={500} />
          <a href={output} download={fileName} className="btn btn-info h-6 min-h-6 absolute top-3 right-4">保存</a>
          <PhotoView src={output}>
            <button ref={viewButtonRef} className="btn btn-success h-6 min-h-6 absolute top-11 right-4">查看</button>
          </PhotoView>
        </animated.div>
      </animated.div>
    </PhotoProvider>
  )
}