import * as React from "react"
import { Frame as CoreFrame, FrameProperties as CoreFrameProperties } from "../render"
//import { WithEvents, WithEventsProperties } from "./hoc/WithEvents"

export type FrameProperties = CoreFrameProperties & WithEventsProperties
//export const Frame: React.ComponentClass<Partial<FrameProperties>> = WithEvents(CoreFrame)
export type Frame = React.Component<FrameProperties>
