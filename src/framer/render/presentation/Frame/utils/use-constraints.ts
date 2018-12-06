import { useContext, useRef } from "react"
import sync from "framesync"
import { ParentSizeContext } from "../ParentSizeContext"
import { ConstraintMotionValues } from "../../../types/Constraints"
import { motionValue } from "../../../../../"
import { isMotionValue } from "../../../utils/isMotionValue"
import { MotionRect, FrameProps } from "../types"

type Rect = {
    width: number
    height: number
    x: number
    y: number
}

const createMotionValue = (key: string, motionRect: Partial<MotionRect>, rect: Rect, props: Partial<FrameProps>) => {
    if (isMotionValue(props[key])) {
        motionRect[key] = props[key]
        props[key].set(rect[key], false)
    } else {
        motionRect[key] = motionValue(rect[key])
    }
}

export const isMotionRect = (v: any): v is MotionRect => v !== null

export const useConstraints = (props: Partial<FrameProps>) => {
    const {
        left = null,
        right = null,
        top = null,
        bottom = null,
        centerX = "50%",
        centerY = "50%",
        width = 100,
        height = 100,
        aspectRatio = null,
        autoSize,
    } = props
    const motionRectRef = useRef<MotionRect>(null)
    const parentRect = useContext(ParentSizeContext)

    const calculateSize = () => {
        const constraints = ConstraintMotionValues.fromProperties({
            left,
            right,
            top,
            bottom,
            centerX,
            centerY,
            width,
            height,
            aspectRatio,
            autoSize,
        })

        const rect = ConstraintMotionValues.toRect(constraints, parentRect, null, true)

        return rect
    }

    const recalculateSize = () => {
        const motionRect = motionRectRef.current
        if (motionRect === null) return
        const rect = calculateSize()

        motionRect.width.set(rect.width)
        motionRect.height.set(rect.height)
        motionRect.x.set(rect.x)
        motionRect.y.set(rect.y)
    }

    if (!isMotionRect(motionRectRef.current)) {
        const currentRect = calculateSize()
        const motionRect: Partial<MotionRect> = {}
        createMotionValue("width", motionRect, currentRect, props)
        createMotionValue("height", motionRect, currentRect, props)
        createMotionValue("x", motionRect, currentRect, props)
        createMotionValue("y", motionRect, currentRect, props)
        motionRectRef.current = motionRect
    } else {
        recalculateSize()
    }

    if (isMotionRect(parentRect)) {
        parentRect.width.addSubscriber(() => sync.update(recalculateSize, false, true))
        parentRect.height.addSubscriber(() => sync.update(recalculateSize, false, true))
    }

    return motionRectRef.current as MotionRect
}
