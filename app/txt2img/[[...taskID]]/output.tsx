'use client'

import { useState, useEffect, useRef } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import { animated, useTransition } from '@react-spring/web'

export default function Output({
  output
}: {
  output: string
}) {
  const [isVisible, setIsVisible] = useState(false)
  const viewButtonRef = useRef<HTMLButtonElement>(null);
  const fileName = output.split('/').pop();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 400);

    const timer2 = setTimeout(() => {
      // 自动滚动到屏幕底边
      const main = document.getElementById('main');
      if (main) {
        main.style.scrollBehavior = 'smooth'; // 滚动平滑的样式
        main.scrollTop = main.scrollHeight;
      }
    }, 700);

    return () => {
      clearTimeout(timer)
      clearTimeout(timer2)
    }
  }, [])

  const transitions = useTransition(isVisible ? [1] : [], {
    from: { opacity: 0, y: 60 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 60 },
  })

  const handleImg = () => {
    viewButtonRef.current?.click()
  }

  return (
    <>
      {transitions((style, item) =>
        item && (
          <animated.div style={style}>
            <PhotoProvider>
              <animated.div className="relative aspect-[16/8] rounded-lg border border-input p-0.5 overflow-hidden mb-8">
                <img
                  className="rounded-lg w-full h-full object-contain block cursor-pointer"
                  onClick={handleImg}
                  alt=""
                  src={output}
                />
                <a
                  href={output}
                  download={fileName}
                  className="btn btn-success h-6 min-h-6 absolute top-3 right-4"
                >
                  保存
                </a>
                <PhotoView src={output}>
                  <button
                    ref={viewButtonRef}
                    className="btn btn-warning h-6 min-h-6 absolute top-10 right-4"
                  >
                    查看
                  </button>
                </PhotoView>
              </animated.div>
            </PhotoProvider>
          </animated.div>
        )
      )}
    </>
  )
}