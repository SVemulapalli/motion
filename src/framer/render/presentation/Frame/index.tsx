import * as React from "react"
import { FrameProps } from "./types"
import { FrameBorder } from "./FrameBorder"
import { ParentSizeContext } from "./ParentSizeContext"
import { useMotionComponent } from "./utils/use-motion-component"
import { useConstraints } from "./utils/use-constraints"
import { useStylesAndMotionValues } from "./utils/use-styles-and-motion-values"

export const Frame = ({ id, className, visible = true, children, ...props }: FrameProps) => {
    if (!visible) return null

    const Div = useMotionComponent({})
    const motionRect = useConstraints(props)
    const [style, motionValues] = useStylesAndMotionValues(props)

    return (
        <Div id={id} className={className} style={style} motionValues={{ ...motionRect, ...motionValues }}>
            <ParentSizeContext.Provider value={motionRect}>
                {children}
                {props.borderWidth ? <FrameBorder {...props} borderRadius={style.borderRadius} /> : null}
            </ParentSizeContext.Provider>
        </Div>
    )
}
