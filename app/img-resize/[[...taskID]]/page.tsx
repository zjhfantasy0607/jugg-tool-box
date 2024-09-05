'use client'

import Progress from "../../ui/progress"
import Upload from "./upload"
import Output from "./output"
import { useState, useEffect, useRef, useCallback } from "react"
import { selectTask, selectTotalRank } from "@/store/slices/progressSlice"
import { updateUserinfo } from "@/store/slices/userinfoSlice"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { getTask, imgResize } from "../../lib/api"
import { progressUp } from "@/store/slices/progressSlice"
import toast from "react-hot-toast"

export default function Resize({ params }: { params: { taskID: string[] } }) {
  const querytaskID = (params.taskID && params.taskID[0]) || ''
  const outputPath = process.env.NEXT_PUBLIC_OUTPUT_PATH as string

  const [taskID, setTaskID] = useState<string>(querytaskID)
  const [origin, setOrigin] = useState<string>('')
  const [output, setOutput] = useState<string[]>([])
  const [inputParams, setInputParams] = useState({resize: "2"})

  const reduxDispatch = useAppDispatch()
  const task = useAppSelector(state => selectTask(state, taskID))
  const totalRank = useAppSelector(selectTotalRank)
  const prevProgress = useRef<number>(0)

  // 存在默认task_id，展示后台中已有的任务
  useEffect(() => {
    if (querytaskID && taskID) {
      (async () => {
        const response = await getTask(taskID)
        if (!(response && response.code == 200)) {
          return
        }
        if (response.data.task?.output) {
          setOutput(JSON.parse(response.data.task.output))
        }
        if (response.data.task?.source) {
          const source = JSON.parse(response.data.task.source)[0] || ''
          let origin = "/images/upload/" + source.replace(/\\/g, '/')
          setOrigin(origin)
        }
        if (response.data.task?.params) {
          const params = JSON.parse(response.data.task.params) || {}
          setInputParams(params)
        }
      })()
    }
  }, [])

  useEffect(() => {
    const lastProgress = prevProgress.current
    prevProgress.current = task?.progress

    if (lastProgress == 1 && task == null) {
      toast.success("任务完成");
      (async () => {
        const response = await getTask(taskID)
        if (response && response.code == 200 && response.data.task?.output) {
          setOutput(JSON.parse(response.data.task.output))
        }
      })()
    }
  }, [task])

  const uploadCallback = useCallback((imgbase64: string) => {
    setTaskID('') // 清空当前任务Id
    setOutput([]) // 清空生成结果
    setOrigin(imgbase64)
  }, [])

  const submitCallback = useCallback(async (imgbase64: string, resize: string) => {
    const response = await imgResize(imgbase64, resize);
    if (response?.code == 200) {
      const taskID = response?.data?.taskID
      // 启动任务进程监听
      reduxDispatch(progressUp())
      // 更新用户信息
      reduxDispatch(updateUserinfo())
      // 设置taskID
      setTaskID(taskID)
      // 更新url地址
      const newUrl = `/img-resize` + (taskID ? '/' : '') + taskID
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl)
      // 成功提示
      toast.success("任务已加入后台")
      // 清空生成结果
      setOutput([])
    } else {
      toast.error(response?.msg || "未知错误，请重试")
    }
  }, [reduxDispatch])

  return (
    <div className="relative">
      {/* 图片上传 */}
      <Upload uploadCallback={uploadCallback} submitCallback={submitCallback} origin={origin} inputParams={inputParams} />

      {/* 进度条 */}
      <Progress task={{ ...task, totalRank: totalRank }} />

      {/* 生成结果展示 */}
      {output.map((item, index) => <Output key={index} origin={origin} output={outputPath + item} />)}
    </div>
  );
}