import { buildStyleProperty } from "stylefire"

export const convertSizeToStyle = (size, style) => {
    return buildStyleProperty({ ...size, ...style })
}
