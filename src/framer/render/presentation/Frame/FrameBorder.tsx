import * as React from "react"
import { useContext } from "react"
import { ParentSizeContext } from "./ParentSizeContext"
import { FrameProps } from "./types"
import { isMotionRect } from "./utils/use-constraints"

const baseStyle = {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    pointerEvents: "none",
}

const constrainBorder = (v: number, min: number, max: number): [number, number] => {
    if (min + max > v) {
        const ratio = min / (min + max)
        return [Math.round(ratio * v), v - min]
    }

    return [min, max]
}

type BorderProps = {
    borderRadius: string | number | undefined
}

const useBorderStyle = ({ borderWidth = 0, borderStyle = "solid", borderColor = "#000" }: Partial<FrameProps>) => {
    let borderTop: number = 0
    let borderBottom: number = 0
    let borderLeft: number = 0
    let borderRight: number = 0

    if (typeof borderWidth === "number") {
        borderTop = borderBottom = borderLeft = borderRight = borderWidth
    } else {
        borderTop = borderWidth.top || 0
        borderBottom = borderWidth.bottom || 0
        borderLeft = borderWidth.left || 0
        borderRight = borderWidth.right || 0
    }

    if (borderTop === 0 && borderBottom === 0 && borderLeft === 0 && borderRight === 0) {
        return {}
    }

    // Constrain borders according to parent size
    const rect = useContext(ParentSizeContext)
    if (isMotionRect(rect)) {
        ;[borderTop, borderBottom] = constrainBorder(rect.height.get(), borderTop, borderBottom)
        ;[borderLeft, borderRight] = constrainBorder(rect.width.get(), borderLeft, borderRight)
    }

    return {
        ...baseStyle,
        borderStyle,
        borderColor,
        borderTopWidth: `${borderTop}px`,
        borderRightWidth: `${borderRight}px`,
        borderBottomWidth: `${borderBottom}px`,
        borderLeftWidth: `${borderLeft}px`,
    }
}

export const FrameBorder = (props: Partial<FrameProps> & BorderProps) => <div style={useBorderStyle(props)} />
