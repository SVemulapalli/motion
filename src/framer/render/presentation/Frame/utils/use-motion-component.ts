import { useMemo } from "react"
import { motion, PoseConfig } from "../../../../../"

export const useMotionComponent = (poses?: PoseConfig) => useMemo(() => motion.div(poses), [])
