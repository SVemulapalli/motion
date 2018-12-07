import { FrameProps } from "../types"
import { RenderTarget, RenderEnvironment } from "../../../types/RenderEnvironment"
import { useMemo } from "react"
import { isMotionValue } from "../../../../render/utils/isMotionValue"

export const transformDefaults: TransformProperties = {
    z: 0,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
    scaleZ: 1,
    skew: 0,
    skewX: 0,
    skewY: 0,
    originX: 0.5,
    originY: 0.5,
    originZ: 0,
}

const transformKeys = Object.keys(transformDefaults)

const force3d = RenderEnvironment.target === RenderTarget.export

const resolve = (key: string, props: Partial<FrameProps>, output) => {
    if (output[key] !== undefined) return output[key]
    if (props[key] !== undefined) return props[key]
    return transformDefaults[key]
}

export const useTransformTemplate = (props: Partial<FrameProps>, motionValues) => {
    // Add any motion values to values map
    useMemo(() => {
        transformKeys.forEach(key => {
            if (isMotionValue(props[key])) {
                motionValues[key] = props[key]
            }
        })
    }, [])

    return output => {
        const x = output.x
        const y = output.y
        const z = resolve("z", props, output)
        const scale = resolve("scale", props, output)
        const scaleX = resolve("scaleX", props, output)
        const scaleY = resolve("scaleY", props, output)
        const scaleZ = resolve("scaleZ", props, output)
        const skew = resolve("skew", props, output)
        const skewX = resolve("skewX", props, output)
        const skewY = resolve("skewY", props, output)
        const originZ = resolve("originZ", props, output)
        const rotate = resolve("rotate", props, output)
        const rotateX = resolve("rotateX", props, output)
        const rotateY = resolve("rotateY", props, output)
        const rotateZ = resolve("rotateZ", props, output)

        if (force3d || z !== 0 || scaleZ !== 1 || originZ !== 0 || rotateZ !== 0 || rotateX !== 0 || rotateY !== 0) {
            return `
              translate3d(${x}, ${y}, ${z})
              scale3d(${scaleX * scale}, ${scaleY * scale}, ${scaleZ})
              skew(${skew},${skew})
              skewX(${skewX})
              skewY(${skewY})
              translateZ(${originZ}px)
              rotateX(${rotateX})
              rotateY(${rotateY})
              rotateZ(${parseFloat(rotate) + parseFloat(rotateZ)}deg)
              translateZ(${-originZ}px)
            `
        } else {
            return `
              translate(${x}, ${y})
              scale(${scaleX * scale}, ${scaleY * scale})
              skew(${skew},${skew})
              skewX(${skewX})
              skewY(${skewY})
              rotate(${rotate})
            `
        }
    }
}
