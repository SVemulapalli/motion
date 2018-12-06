import * as React from "react"
import { RenderEnvironment, RenderTarget } from "../render/types/RenderEnvironment"
import { Frame, FrameProperties } from "./Frame"
import { Size } from "../render/types/Size"
import { Color } from "../render"

export interface Props {
    // tslint:disable:react-unused-props-and-state
    children: React.ReactNode
    size: Size
    title?: string
    hide?: boolean
    showArrow?: boolean
    styleOverrides?: Partial<FrameProperties>
}

export function EmptyState({
    title = "Connect to content",
    children,
    size,
    hide,
    showArrow = true,
    styleOverrides,
}: Props) {
    const { zoom, target } = RenderEnvironment
    if (target !== RenderTarget.canvas) return null
    if (hide) return null
    const childCount = React.Children.count(children)
    if (childCount !== 0) return null

    const width = size.width
    const height = size.height

    if (width < 0 || height < 0) return null

    const showText = width * zoom > title.length * 8 && height * zoom > 50

    const color = styleOverrides && styleOverrides.color ? styleOverrides.color : "#85F"
    const colorValue = Color.isColorObject(color) ? color.initialValue || Color.toRgbString(color) : color

    return (
        <Frame
            key={`empty-state`}
            top={0}
            left={0}
            width={width}
            height={height}
            background={"rgba(136, 85, 255,0.2)"}
            color={color}
            style={{ lineHeight: `${height}px`, fontSize: 12 / zoom }}
            {...styleOverrides}
        >
            <span
                style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {showText && title}
                {showText && showArrow && arrow(colorValue, zoom)}
            </span>
        </Frame>
    )
}

function arrow(color: string, zoom: number) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={14 / zoom}
            height={7 / zoom}
            viewBox={`0 0 14 7`}
            style={{
                position: "relative",
                display: "inline",
                width: 14 / zoom,
                marginLeft: 4 / zoom,
            }}
        >
            <g transform="translate(0.5 0.5)">
                <path d="M 0 3 L 12 3" fill="transparent" stroke={color} strokeLinecap="round" />
                <path d="M 9 0 L 12 3 L 9 6" fill="transparent" stroke={color} strokeLinecap="round" />
            </g>
        </svg>
    )
}
