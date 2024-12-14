'use client'

import { useState, useEffect } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import { animated, useTransition } from '@react-spring/web'

export default function Output({
  origin, output
}: {
  origin: string
  output: string
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 400)

    return () => clearTimeout(timer)
  }, [])

  const transitions = useTransition(isVisible ? [1] : [], {
    from: { opacity: 0, y: 60 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 60 },
  })

  const fileName = output.split('/').pop();

  return (
    <>
      {transitions((style, item) => 
        item && (
          <animated.div style={style}>
            <PhotoProvider>
              <PhotoView src={origin}></PhotoView>

              <animated.div className="diff aspect-[16/9] rounded-lg border border-input p-0.5 overflow-hidden">
                <div className="diff-item-1">
                  <img className="rounded-lg" alt="" src={output} />
                </div>
                <div className="diff-item-2">
                  <img
                    className="rounded-lg"
                    alt=""
                    src={origin}
                  />
                </div>
                <div className="diff-resizer w-44 sm:w-60"></div>
                <a href={output} download={fileName} className="btn btn-success h-6 min-h-6 absolute top-3 right-4">保存</a>
                <PhotoView src={output}>
                  <button className="btn btn-warning h-6 min-h-6 absolute top-10 right-4">查看</button>
                </PhotoView>
              </animated.div>

            </PhotoProvider>
          </animated.div>
        )
      )}
    </>
  )
}