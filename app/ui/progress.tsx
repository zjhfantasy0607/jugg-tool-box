'use client'

import { Task } from '@/store/slices/progressSlice'
import { useSpring, animated } from '@react-spring/web'
import React from 'react'

interface NewTask extends Task {
  totalRank: Number;
}

export default function Progress({ task }: { task: NewTask }) {
  const isPending = (task.status == 'pending')

  // 框加载动画
  const [styles, api] = useSpring(() => ({ height: 0, opacity: 0, }))
  if (task?.status == "producing" || isPending) {
    api.start({ height: 102, opacity: 1 })
  } else {
    api.start({ height: 0, opacity: 0 })
  }

  // 数字变更动画效果
  let progress = Math.ceil((task.progress || 0) * 100)
  // 进度默认会在1%的时候卡顿一会，影响体验，故修改为 0
  if (progress == 1) {
    progress = 0
  }

  const props = useSpring({
    progress: progress,
  })

  return (
    <animated.div className="w-full flex mt-5 justify-center overflow-hidden" style={styles}>
      <animated.div className="w-full h-[62px] bg-card rounded-lg border border-input py-2 px-6" >
        <div className="flex justify-between">
          <span className="text-sm">{isPending ? '等待GPU服务器...' : '生成中...'}</span>
          {/*isPending && <Rank props={props} />*/}
          {isPending && <div>第 {task.rank.toString()} 位 / 总 {task.totalRank.toString()} 人</div>}
          {!isPending && <animated.span className="text-sm">{props.progress.to(v => `${v.toFixed(0)}%`)}</animated.span>}
        </div>
        <div>
          {isPending && <progress className="progress"></progress>}
          {!isPending && <div className="h-6 flex items-center">
            <div className="w-full h-2 bg-[#cccccc] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-black transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>}
        </div>
      </animated.div>
    </animated.div>
  )
}