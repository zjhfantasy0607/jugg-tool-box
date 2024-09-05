'use client'

import { PhotoProvider, PhotoView } from 'react-photo-view'
import { animated, useTransition } from '@react-spring/web'

export default function Output({
  origin, output
}: {
  origin: string
  output: string
}) {
  const fileName = new URL(output, window.location.href).pathname.split('/').pop()

  const transitions = useTransition(null, {
    from: { opacity: 0, y: 60 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 1, y: 0 },
    delay: 400
  })

  return transitions((style) => (
    <animated.div style={style}>
      <PhotoProvider>
        <PhotoView src={origin}></PhotoView>
        <animated.div className="flex justify-center px-5">
          <div className="diff aspect-[16/9] w-[32rem] rounded-lg border border-input p-0.5">
            <div className="diff-item-1">
              <img className="rounded-lg" alt="daisy" src={output} />
            </div>
            <div className="diff-item-2">
              <img
                className="rounded-lg"
                alt="daisy"
                src={origin}
              />
            </div>
            <div className="diff-resizer w-44 sm:w-60"></div>
            <a href={output} download={fileName} className="btn btn-success h-6 min-h-6 absolute top-3 right-4">保存</a>
            <PhotoView src={output}>
              <button className="btn btn-warning h-6 min-h-6 absolute top-10 right-4">查看</button>
            </PhotoView>
          </div>
        </animated.div>
      </PhotoProvider>
    </animated.div>
  ))
}
