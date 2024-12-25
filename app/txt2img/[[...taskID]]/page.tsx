import Client from "./client"
import { getTask } from "@/app/lib/api"

export default async function Tx2img({ params }: { params: { taskID: string[] } }) {
    const queryTaskId = (params.taskID && params.taskID[0]) || '';

    let outputImgs = [];
    let inputParams = {
        width: 896,
        height: 1152,
        prompt: '',
        negative_prompt: '',
        sd_model_checkpoint: '',
        seed: -1
    };

    if (queryTaskId) {
        const response = await getTask(queryTaskId)
        if (!(response && response.code == 200)) {
            return
        }
        if (response.data.task?.output) {
            outputImgs = JSON.parse(response.data.task.output)
        }
        if (response.data.task?.params) {
            inputParams = JSON.parse(response.data.task.params) || {}
        }
    }

    return (
        <Client defTaskId={queryTaskId} defOutputImgs={outputImgs} defInputParams={inputParams} />
    )
}