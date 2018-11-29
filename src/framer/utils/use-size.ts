import { useContext, useRef } from "react"
import { ParentSizeContext } from "../ParentSizeContext"
import { MotionValue } from "../../motion-value"
import { useTransform } from "../../hooks/use-transform"

export const useSize = ({ width, height, left, right }) => {
    const parentSize = useContext(ParentSizeContext)
    const size = useRef({
        position: parentSize ? "absolute" : "relative",
    }).current

    if (width) {
        size.width = width instanceof MotionValue ? width.get() : width
    } else if (left || right) {
        if (parentSize.width instanceof MotionValue) {
        } else {
            size.width = parentSize.width - left - right
        }
    }

    size.height = height

    if (left) {
        size.x = left
    } else if (right) {
        size.x = parentSize.width - size.width - right
    }

    return size
}
