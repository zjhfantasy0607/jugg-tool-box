'use client'

import Progress from "@/app/ui/progress"
import { Txt2imgParams } from "@/app/lib/apiTypes";
import { txt2img, getTask } from "@/app/lib/api";
import Output from "./output"
import Workbench from "./workbench";
import { useState, useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { updateUserinfo } from "@/store/slices/userinfoSlice";
import { selectTask, selectTotalRank, progressStart } from "@/store/slices/progressSlice";
import toast from "react-hot-toast";

export default function Client({
  defTaskId, defOutputImgs, defInputParams
}: {
  defTaskId: string, defOutputImgs: string[], defInputParams: Txt2imgParams
}) {
  const [taskId, setTaskID] = useState<string>(defTaskId);
  const [outputImgs, setOutputImgs] = useState<string[]>(defOutputImgs);
  const [inputParams, setInputParams] = useState<Txt2imgParams>(defInputParams);

  const reduxDispatch = useAppDispatch();
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
      if (task?.params) {
        const params = JSON.parse(task.params) || {}
        setInputParams(params)
      }

      toast.success("任务完成")

    } else if (task?.status === "failed") {
      toast.error("任务失败，已返还积分");
    }
  }, [task, defTaskId, taskId]);

  const submitCallback = useCallback(async (config: Txt2imgParams) => {
    const response = await txt2img(config);
    if (response?.code == 200) {
      const taskId = response.data.taskID;
      // 启动任务进程监听
      reduxDispatch(progressStart());
      // 更新用户信息
      reduxDispatch(updateUserinfo());
      // 设置taskID
      setTaskID(taskId);
      // 清空output
      setOutputImgs([]);
      // 更新url地址
      const newUrl = `/txt2img` + (taskId ? '/' : '') + taskId;
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
      // 成功提示
      toast.success("任务已加入后台")
      // 清空生成结果
      setOutputImgs([]);
      // 清空记录的任务状态
      statusRef.current = ""
    } else {
      toast.error(response?.msg || "错误，请刷新后重试")
    }
  }, [reduxDispatch]);

  return <div className="relative w-[40rem] lg:h-auto h-screen max-w-full mx-auto px-5 overflow-hidde">
    <Workbench submitCallback={submitCallback} inputParams={inputParams} />

    {/* 进度条 */}
    <Progress task={{ ...task, totalRank: totalRank }} />

    {/* 生成结果展示 */}
    {outputImgs.map((item, index) => <Output key={index} output={item.replace(/\\/g, '/')} />)}
  </div>
}