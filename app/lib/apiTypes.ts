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

export function isValidKey(
    key: string | number | symbol,
    object: object
): key is keyof typeof object {
    return key in object;
}