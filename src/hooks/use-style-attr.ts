import { useMemo, CSSProperties } from "react"
import { buildStyleProperty } from "stylefire"
import { MotionValue } from "../motion-value"
import { resolveCurrent } from "../utils/resolve-values"
import { MotionProps } from "motion/types"

export const useInitialStyleAttr = (
    values: Map<string, MotionValue>,
    { style, transformTemplate }: MotionProps
): CSSProperties => {
    return useMemo(() => {
        const resolvedValues = resolveCurrent(values)

        if (transformTemplate) resolvedValues.transform = transformTemplate

        return {
            ...style,
            ...buildStyleProperty(resolvedValues),
        }
    }, [])
}
