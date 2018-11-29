import { useContext, useMemo, useRef } from "react"
import { ParentSizeContext } from "../ParentSizeContext"
import { useMotionValue } from "../../motion-value/use-motion-value"

const calcWidth = (width, left = 0, right = 0, parentWidth) => {
    if (width !== undefined) {
        return width
    } else {
        return parentWidth - left - right
    }
}

const calcX = (width, left, right, parentWidth) => {
    if (left) {
        return left
    } else if (right) {
        return parentWidth - width - right
    }

    return 0
}

export const useConstraints = c => {
    const parentSize = useContext(ParentSizeContext)

    const resolved = {
        position: parentSize ? "absolute" : "relative",
        height: 500,
        width: useMotionValue(calcWidth(c.width, c.left, c.right, parentSize && parentSize.width.get())),
        x: useMotionValue(calcX(c.width, c.left, c.right, parentSize && parentSize.width.get())),
    }

    const isWidthBoundToParent = c.width === undefined

    const deriveWidthFromParent = useRef(parentWidth => {
        resolved.width.set(parentWidth - c.left - c.right)
    })

    if (isWidthBoundToParent) {
        parentSize.width.addSubscriber(deriveWidthFromParent.current)
    }

    const isXBoundToWidth = c.left === undefined && c.right !== undefined

    const deriveXFromWidth = useRef(thisWidth => {
        resolved.x.set(parentSize.width.get() - thisWidth - c.right)
    })

    if (isXBoundToWidth) {
        resolved.width.addSubscriber(deriveXFromWidth.current)
    }

    return resolved
}

// import { useContext, useRef } from "react"
// import { ParentSizeContext } from "../ParentSizeContext"
// import { MotionValue } from "../../motion-value"
// import { useTransform } from "../../hooks/use-transform"

// export const useSize = ({ width, height, left, right }) => {
//     const parentSize = useContext(ParentSizeContext)
//     const size = useRef({
//         position: parentSize ? "absolute" : "relative",
//     }).current

//     if (width) {
//         size.width = width instanceof MotionValue ? width.get() : width
//     } else if (left || right) {
//         if (parentSize.width instanceof MotionValue) {
//             size.width = parentSize.width.addChild({ transformer: (v: number) => left - right })
//         } else {
//             size.width = parentSize.width - left - right
//         }
//     }

//     size.height = 500

//     if (left) {
//         size.x = left
//     } else if (right) {
//         size.x = parentSize.width - size.width - right
//     }

//     return size
// }
