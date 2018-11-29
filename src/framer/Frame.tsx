import { useMemo, useRef, HTMLAttributes } from "react"
import { ComponentFactory } from "../motion/types"
import { motion } from "../motion"
import { ParentSizeContext } from "./ParentSizeContext"
import { useConstraints } from "./utils/use-constraints"

type FrameComponent = ComponentFactory<HTMLAttributes<HTMLDivElement>>
type FrameProps = {}

const Frame: FrameComponent = ({ constraints, poses, style, ...props }: FrameProps) => {
    const { width, x, ...constraintStyles } = useConstraints(constraints)

    const Div = useMemo(() => motion.div(poses), [])

    return (
        <ParentSizeContext.Provider value={{ width, x }}>
            <Div {...props} motionValues={{ width, x }} style={{ ...style, ...constraintStyles }} />
        </ParentSizeContext.Provider>
    )
}

export { Frame }

// import { PoseConfig, ComponentFactory, PoseConfigFactory } from "../motion/types"
// import { HTMLAttributes } from "react"
// import { motion } from "../motion"

// const frameDefaults = {
//     x: 0,
//     y: 0,
//     rotate: 0,
//     width: 100,
//     height: 100,
//     background: "#0AF",
// }

// const extendConfig = <Config extends PoseConfigFactory | PoseConfig>(
//     config: Config | undefined,
//     extension: PoseConfig
// ): PoseConfigFactory | PoseConfig => {
//     if (!config) {
//         return extension
//     }
//     if (typeof config === "function") {
//         return (...args: any) => {
//             const configFactory = config as PoseConfigFactory
//             return { ...extension, ...configFactory(args) }
//         }
//     }
//     const c = config as PoseConfig
//     return { ...extension, ...c }
// }

// export const Frame: ComponentFactory<HTMLAttributes<HTMLDivElement>> = <Config extends PoseConfigFactory | PoseConfig>(
//     config?: Config
// ) => {
//     const divConfig = extendConfig(config, { default: frameDefaults })
//     return motion.div(divConfig)
// }
