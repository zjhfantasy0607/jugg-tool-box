import Client from "./client"
import { getTask } from "@/app/lib/api"

export default async function ({ params }: { params: { taskID: string[] } }) {
    const queryTaskId = (params.taskID && params.taskID[0]) || '';

    let inputImg = '';
    let outputImgs = [];
    let inputParams = { is_anime: false, return_mask: false, input_image: "" };

    if (queryTaskId) {
        const response = await getTask(queryTaskId)
        if (!(response && response.code == 200)) {
            return
        }
        if (response.data.task?.output) {
            outputImgs = JSON.parse(response.data.task.output)
        }
        if (response.data.task?.source) {
            const source = JSON.parse(response.data.task.source)[0] || ''
            inputImg = "/images/upload/" + source.replace(/\\/g, '/')
        }
        if (response.data.task?.params) {
            inputParams = JSON.parse(response.data.task.params) || {}
        }
    }

    return (
        <Client defTaskId={queryTaskId} defInputImg={inputImg} defOutputImgs={outputImgs} defInputParams={inputParams} />
    )
}