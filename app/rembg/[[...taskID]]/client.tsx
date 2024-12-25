'use client'

import Progress from "../../ui/progress"
import Workbench from "./workbench"
import Output from "./output"
import { useState, useEffect, useCallback, useRef } from "react"
import { selectTask, selectTotalRank, progressStart } from "@/store/slices/progressSlice"
import { updateUserinfo } from "@/store/slices/userinfoSlice"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { rembg } from "@/app/lib/api"
import { RembgParams } from "@/app/lib/apiTypes"
import toast from "react-hot-toast"

export default function Client({
  defTaskId, defInputImg, defOutputImgs, defInputParams
}: {
  defTaskId: string, defInputImg: string, defOutputImgs: string[], defInputParams: RembgParams
}) {
  const [taskId, setTaskId] = useState<string>(defTaskId);
  const [outputImgs, setOutputImgs] = useState<string[]>(defOutputImgs);

  const reduxDispatch = useAppDispatch()
  const task = useAppSelector(state => selectTask(state, taskId));
  const totalRank = useAppSelector(selectTotalRank);
  const statusRef = useRef<string>(task?.status);

  useEffect(() => {
    // 配合statusRef 避免 完成任务 在不符合的场景显示出来
    if (defTaskId && taskId && statusRef.current == "success") {
      return
    }

    if (task?.status === "success") {
      if (task?.output) {
        setOutputImgs(JSON.parse(task.output));
      }
      toast.success("任务完成");
    } else if (task?.status === "failed") {
      toast.error("任务失败，已返还积分");
    }
  }, [task, defTaskId, taskId]);

  const uploadCallback = useCallback(() => {
    setTaskId('') // 清空当前任务Id
    setOutputImgs([]) // 清空生成结果
  }, []);

  const submitCallback = useCallback(async (params: RembgParams) => {
    const response = await rembg(params);
    if (response.code == 200) {
      const taskID = response?.data?.taskID
      // 启动任务进程监听
      reduxDispatch(progressStart())
      // 更新用户信息
      reduxDispatch(updateUserinfo())
      // 设置taskID
      setTaskId(taskID)
      // 清空output
      setOutputImgs([]);
      // 更新url地址
      const newUrl = `/rembg` + (taskID ? '/' : '') + taskID
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl)
      // 成功提示
      toast.success("任务已加入后台")
      // 清空记录的任务状态
      statusRef.current = ""
    } else {
      toast.error(response?.msg || "未知错误，请重试")
    }
  }, [reduxDispatch])

  return (
    <div className="relative w-[40rem] max-w-full my-5 mx-auto px-5">
      {/* 图片上传 */}
      <Workbench uploadCallback={uploadCallback} submitCallback={submitCallback} inputImg={defInputImg} inputParams={defInputParams} />

      {/* 进度条 */}
      <Progress task={{ ...task, totalRank: totalRank }} />

      {/* 生成结果展示 */}
      {outputImgs.map((item, index) => <Output key={index} output={item.replace(/\\/g, '/')} />)}
    </div>
  );
}