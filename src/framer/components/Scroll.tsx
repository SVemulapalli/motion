import { Draggable } from "./Draggable"
import { FramerEvent } from "../events/FramerEvent"
import * as React from "react"
import { DraggableSpecificProps, DragEventHandler, DraggableProps } from "./hoc/WithDragging"
import { FrameProperties, Rect, PropertyControls, ControlType } from "../render"
import { Frame } from "./Frame"
import { isRectProviding } from "./utils/RectProvider"
import { getObservableNumber } from "../utils/observable"
import { Frame as CoreFrame } from "../render"
import { Animatable } from "../animation/Animatable/Animatable"
import { EmptyState } from "./EmptyState"

type DraggableType = typeof Frame

export type DraggableFrameSpecificProps = Partial<FrameProperties> & Partial<DraggableSpecificProps<DraggableType>>
type DraggableFrameProps = Partial<FrameProperties> & Partial<DraggableProps<DraggableType>>
export type ScrollEventHandler = (event: FramerEvent, scrollComponent: Scroll) => void

export interface ScrollEvents {
    onScrollStart: ScrollEventHandler
    onScroll: ScrollEventHandler
    onScrollEnd: ScrollEventHandler
    onScrollSessionStart: ScrollEventHandler
    onScrollSessionEnd: ScrollEventHandler
}

export interface ScrollProps extends Partial<ScrollEvents>, Partial<DraggableFrameSpecificProps> {
    draggingEnabled: boolean
    direction: "horizontal" | "vertical" | "both"
    directionLock: boolean
    mouseWheel: boolean // TODO: ignored and deprecated; see https://github.com/framer/company/issues/10018 for future direction
    contentOffsetX: number | Animatable<number> | null
    contentOffsetY: number | Animatable<number> | null
}

export interface Props extends ScrollProps {}

/**
 * Scroll Component
 * @public
 */
export class Scroll extends React.Component<Partial<Props>> {
    static _stylableContainer = true
    static supportsConstraints = true

    static scrollProps: ScrollProps = {
        draggingEnabled: true,
        direction: "vertical",
        directionLock: true,
        mouseWheel: true,
        contentOffsetX: null,
        contentOffsetY: null,
    }

    static defaultProps: FrameProperties & ScrollProps = Object.assign({}, CoreFrame.defaultProps, Scroll.scrollProps, {
        overflow: "visible",
        background: "none",
        width: "100%",
        height: "100%",
    })

    static propertyControls: PropertyControls<ScrollProps> = {
        direction: {
            type: ControlType.SegmentedEnum,
            title: "Direction",
            options: ["vertical", "horizontal", "both"],
        },
        directionLock: {
            type: ControlType.Boolean,
            title: "Lock",
            enabledTitle: "1 Axis",
            disabledTitle: "Off",
            hidden(props) {
                return props.direction !== "both"
            },
        },
    }

    draggable: any | null

    get properties(): Props {
        // React takes care of this, as long as defaultProps are defined: https://reactjs.org/docs/react-component.html#defaultprops
        return this.props as Props
    }

    private wrapHandlers(
        dragHandler?: DragEventHandler<DraggableType> | undefined,
        scrollHandler?: ScrollEventHandler
    ): DragEventHandler<DraggableType> | undefined {
        if (!scrollHandler) {
            return dragHandler
        }
        return (event: FramerEvent, draggable: typeof Frame) => {
            if (dragHandler) {
                dragHandler(event, draggable)
            }
            scrollHandler(event, this)
        }
    }

    render() {
        const frameProps: Partial<FrameProperties> = Object.assign({}, this.props)
        Object.keys(Scroll.scrollProps).map(key => {
            delete frameProps[key]
        })

        // If there are no children we render a single child at the size of the component so we have visual feedback.
        if (!this.props.children) {
            return (
                <Frame {...frameProps}>
                    <Draggable width={frameProps.width} height={frameProps.height} />
                </Frame>
            )
        }

        // TODO: Move this to Frame.contentFrame
        const contentSize = { top: 0, left: 0, bottom: 0, right: 0 }
        const { width, height } = CoreFrame.rect(frameProps)
        const children = React.Children.map(this.props.children, (child: React.ReactChild, index: number) => {
            if (child === null || typeof child !== "object" || typeof child.type === "string") {
                return child
            }
            const type = child.type
            if (isRectProviding(type)) {
                const frame = type.rect(child.props)
                // TODO: move this to utils/frame as merge(frame: Frame)?
                contentSize.top = Math.min(Rect.minY(frame), contentSize.top)
                contentSize.left = Math.min(Rect.minX(frame), contentSize.left)
                contentSize.bottom = Math.max(Rect.maxY(frame), contentSize.bottom)
                contentSize.right = Math.max(Rect.maxX(frame), contentSize.right)
            }
            const update: Partial<{ width: number; height: number }> = {}
            if (this.properties.direction === "vertical") {
                update.width = width
            } else if (this.properties.direction === "horizontal") {
                update.height = height
            }
            return React.cloneElement(child, update)
        })
        const { onScrollStart, onScroll, onScrollEnd, onScrollSessionStart, onScrollSessionEnd } = this.props
        const w = getObservableNumber(width)
        const h = getObservableNumber(height)
        const contentW = Math.max(contentSize.right, w)
        const contentH = Math.max(contentSize.bottom, h)
        const x = Math.min(0, w - contentW)
        const y = Math.min(0, h - contentH)
        const constraints = {
            x: x,
            y: y,
            width: contentW + contentW - w,
            height: contentH + contentH - h,
        }
        const draggableProps: Partial<DraggableFrameProps> = {}
        draggableProps.enabled = this.props.draggingEnabled
        draggableProps.background = "none"
        draggableProps.width = contentW
        draggableProps.height = contentH
        draggableProps.constraints = constraints
        draggableProps.onMove = this.props.onMove
        draggableProps.onDragSessionStart = this.wrapHandlers(this.props.onDragSessionStart, onScrollSessionStart)
        draggableProps.onDragSessionMove = this.props.onDragSessionMove
        draggableProps.onDragSessionEnd = this.wrapHandlers(this.props.onDragSessionEnd, onScrollSessionEnd)
        draggableProps.onDragAnimationStart = this.props.onDragAnimationStart
        draggableProps.onDragAnimationEnd = this.props.onDragAnimationEnd
        draggableProps.onDragDidMove = this.wrapHandlers(this.props.onDragDidMove, onScroll)
        draggableProps.onDragDirectionLockStart = this.props.onDragDirectionLockStart
        draggableProps.onDragStart = this.wrapHandlers(this.props.onDragStart, onScrollStart)
        draggableProps.onDragEnd = this.wrapHandlers(this.props.onDragEnd, onScrollEnd)
        draggableProps.onDragWillMove = this.props.onDragWillMove
        draggableProps.horizontal = this.properties.direction !== "vertical"
        draggableProps.vertical = this.properties.direction !== "horizontal"
        draggableProps.directionLock = this.properties.directionLock
        draggableProps.mouseWheel = true // TODO: see https://github.com/framer/company/issues/10018 for future direction
        draggableProps.left = this.properties.contentOffsetX
        draggableProps.top = this.properties.contentOffsetY
        draggableProps.preserve3d = this.properties.preserve3d

        return (
            <Frame {...frameProps}>
                <Draggable {...draggableProps}>{children}</Draggable>
                <EmptyState
                    children={this.props.children!}
                    size={{ width: w, height: h }}
                    title={"Connect to scrollable content"}
                    styleOverrides={{ color: "#09F", background: "rgba(0, 153, 255, 0.3)" }}
                />
            </Frame>
        )
    }
}
