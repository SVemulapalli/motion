import { Shadow } from "../types/Shadow"

export interface FilterNumberProperties {
    brightness: number
    contrast: number
    grayscale: number
    hueRotate: number
    invert: number
    saturate: number
    sepia: number
    blur: number
}

export interface FilterProperties extends FilterNumberProperties {
    dropShadows: Shadow[]
}
