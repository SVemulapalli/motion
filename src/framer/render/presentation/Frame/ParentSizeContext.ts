import { createContext } from "react"
import { MotionRect } from "./types"

export const ParentSizeContext = createContext<MotionRect | null>(null)
