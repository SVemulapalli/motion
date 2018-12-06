import { FrameProps } from "../types"
import { CSSProperties } from "react"
import { MotionValue } from "../../../../.."
import { isMotionValue } from "../../../utils/isMotionValue"
import { RenderEnvironment } from "../../../types/RenderEnvironment"
import { Gradient, LinearGradient, RadialGradient } from "../../../types/Gradient"
import { Color } from "../../../types/Color"
import { Background } from "../../../../render/traits/Background"
import { collectFiltersFromProps } from "../../../../render/utils/filtersForNode"
import { collectBlendingFromProps } from "../../../../render/traits/Blending"
import { collectOverflowFromProps } from "../../../../render/traits/Overflow"
import { collectBoxShadowsForProps } from "../../../../render/style/shadow"
import { isFiniteNumber } from "../../../../render/utils/isFiniteNumber"

type MotionValueMap = { [key: string]: MotionValue }

const baseStyle: CSSProperties = {
    display: "block",
    position: "absolute",
    pointerEvents: undefined,
    userSelect: "none",
}

const converters = {
    backfaceVisible: {
        name: "backfaceVisibility",
        transformer: (v?: boolean) => {
            if (v === true) return "visible"
            if (v === false) return "hidden"
        },
    },
    preserve3d: {
        name: "transformStyle",
        transformer: (v?: boolean) => {
            if (v === true) return "preserve-3d"
            if (v === false) return "flat"
        },
    },
    background: {
        transformer: (v: Background) => {
            if (typeof v === "string") {
                return v
            } else if (LinearGradient.isLinearGradient(v)) {
                return LinearGradient.toCSS(v)
            } else if (RadialGradient.isRadialGradient(v)) {
                return RadialGradient.toCSS(v)
            } else if (Color.isColorObject(v)) {
                return v.initialValue || Color.toRgbString(v)
            }
        },
    },
    color: {
        transformer: (v: Color | string) => {
            if (typeof v === "string") {
                return v
            } else if (Color.isColorObject(v)) {
                return v.initialValue || Color.toRgbString(v)
            }
        },
    },
    radius: {
        transformer: v => {
            if (typeof v === "string" || isFiniteNumber(v)) {
                return v
            } else if (v) {
                const topLeft = v.topLeft
                const topRight = v.topRight
                const bottomRight = v.bottomRight
                const bottomLeft = v.bottomLeft
                if (topLeft || topRight || bottomRight || bottomLeft) {
                    return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`
                }
            }
        },
    },
}

const converterKeys = Object.keys(converters)

const bindConverter = (
    key: keyof typeof converters,
    props: Partial<FrameProps>,
    style: CSSProperties,
    motionValues: MotionValueMap
) => {
    if (props[key] === undefined) return
    const converter = converters[key]
    const toKey = converter.name || key

    if (isMotionValue(props[key])) {
        motionValues[toKey] = converter.transformer
            ? props[key].addChild({ transformer: converter.transformer })
            : props[key]
    } else {
        style[toKey] = converter.transformer ? converter.transformer(props[key]) : props[key]
    }
}

export const useStylesAndMotionValues = (props: Partial<FrameProps>): [CSSProperties, MotionValueMap] => {
    const motionValues: MotionValueMap = {}
    const style = {
        ...baseStyle,
        ...props.style,
    }
    const { perspective } = props

    if (isMotionValue(perspective)) {
        motionValues.perspective = perspective
    } else {
        style.perspective = perspective
    }

    converterKeys.forEach((key: keyof typeof converters) => bindConverter(key, props, style, motionValues))

    collectFiltersFromProps(props, style)
    collectBlendingFromProps(props, style)
    collectOverflowFromProps(props, style)

    if (RenderEnvironment.zoom < 8) collectBoxShadowsForProps(props, style)

    // collectTransformFromProps

    // TODO: collectBackgroundImageFromProps

    if (props.willChangeTransform) style.willChange = "transform"

    return [style, motionValues]
}
