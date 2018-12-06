import { MotionValue } from "../../../../"

import { ConstraintProperties } from "../../types/Constraints"
import { TransformProperties } from "../../traits/Transform"
import { VisualProperties } from "../../style/collectVisualStyleFromProps"
import { BorderStyle } from "../../style/border"

export interface FrameProps extends ConstraintProperties, TransformProperties, VisualProperties {
    visible: boolean
    name?: string
    backfaceVisible?: boolean | MotionValue<boolean>
    perspective?: number | MotionValue<number>
    preserve3d?: boolean | MotionValue<boolean>
    borderWidth: number | Partial<{ top: number; bottom: number; left: number; right: number }>
    borderColor: string
    borderStyle: BorderStyle
    style?: React.CSSProperties
    className?: string
    _overrideForwardingDescription?: { [key: string]: string }
}

export type MotionRect = {
    width: MotionValue<number>
    height: MotionValue<number>
    x: MotionValue<number>
    y: MotionValue<number>
}
