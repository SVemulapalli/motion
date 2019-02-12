import { AnimationManager } from "."
import { useMemo, useEffect } from "react"
import {
    TransitionOrchestrationMap,
    TransitionOrchestrationSingle,
    Variants,
} from "../types"

/**
 *
 * @param variants
 * @param defaultTransition
 * @public
 */
export const useAnimation = (
    variants?: Variants,
    defaultTransition?:
        | TransitionOrchestrationMap
        | TransitionOrchestrationSingle
) => {
    const animationManager = useMemo(() => new AnimationManager(), [])

    if (variants) {
        animationManager.setVariants(variants)
    }

    if (defaultTransition) {
        animationManager.setDefaultTransition(defaultTransition)
    }

    useEffect(() => {
        animationManager.mount()
        return () => animationManager.unmount()
    }, [])

    return animationManager
}
