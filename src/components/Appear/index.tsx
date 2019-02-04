import { ReactChildren } from "react"
import { TargetAndTransition } from "../../types"
import { useTransition } from "./use-transition"

export interface AppearProps {
    enter?: string | TargetAndTransition
    leave?: string | TargetAndTransition
    children?: ReactChildren
}

export const Appear = ({ children, ...props }: AppearProps) => {
    return useTransition(children, props)
}
