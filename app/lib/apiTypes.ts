export interface Txt2imgParams {
    prompt: string
    negative_prompt: string
    width: number
    height: number
    seed: number
    sd_model_checkpoint: string
}

export interface Img2imgParams {
    prompt: string
    negative_prompt: string
    width: number
    height: number
    seed: number
    input_image: string
}

export interface RembgParams {
    is_anime: boolean
    return_mask: boolean
    input_image: string
}

export interface ResizeParams {
    resize: number
}

export interface Tool {
    id: number
    pid: number
    title: string
    description: string
    icon: string
    url: string
    created_at: string
    updated_at: string
    Orders: number
    Tool: string
    children?: Tool[]
}

export interface ToolTree {
    code: number;
    data: {
        tools: Tool[];
    };
    msg: string;
}

export interface Task {
    id: number
    task_id: string
    uid: string
    used_points: number
    tool_title: string
    tool_url: string
    status: string
    params: string
    source: string
    output: string

    created_at: string
    updated_at: string
}

export function isValidKey(
    key: string | number | symbol,
    object: object
): key is keyof typeof object {
    return key in object;
}