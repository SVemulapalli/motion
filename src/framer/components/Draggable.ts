import { Frame } from "./Frame"
import { WithDragging } from "./hoc/WithDragging"
import { DraggableProps } from "./hoc/WithDragging"
import { FrameProperties } from "../render"

export const Draggable: React.ComponentClass<
    Partial<FrameProperties> & Partial<DraggableProps<typeof Frame>>
> = WithDragging(Frame)
