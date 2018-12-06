import * as React from "react"
import { Frame } from "./Frame"
import { Size } from "../render/types/Size"
import { NavigationTransitionOptions, Transition } from "./NavigationTransitions"
import { Rect } from "../render/types/Rect"
import { NavigationContainer } from "./NavigationContainer"
import { FrameProperties, isFiniteNumber } from "../render"
import { rectFromReactNode } from "../components/utils/RectProvider"

/**
 * @internal
 */
export interface Navigator {
    goBack: () => void
    instant: (Component: React.ReactNode) => void
    fade: (component: React.ReactNode) => void
    push: (Component: React.ReactNode) => void
    pushLeft: (Component: React.ReactNode) => void
    pushRight: (Component: React.ReactNode) => void
    pushDown: (Component: React.ReactNode) => void
    pushUp: (Component: React.ReactNode) => void
    modal: (Component: React.ReactNode, overrides?: NavigationTransitionOptions) => void
    overlayTop: (Component: React.ReactNode, overrides?: NavigationTransitionOptions) => void
    overlayBottom: (Component: React.ReactNode, overrides?: NavigationTransitionOptions) => void
    overlayLeft: (Component: React.ReactNode, overrides?: NavigationTransitionOptions) => void
    overlayRight: (Component: React.ReactNode, overrides?: NavigationTransitionOptions) => void
    flipUp: (Component: React.ReactNode) => void
    flipDown: (Component: React.ReactNode) => void
    flipLeft: (Component: React.ReactNode) => void
    flipRight: (Component: React.ReactNode) => void
}

export const NavigatorContext = React.createContext<Navigator | null>(null)

/**
 * @internal
 */
export type NavigationProps = Partial<Rect>

/**
 * @internal
 */
export type NavigationItem = {
    key: string
    component: React.ReactNode
    transition: NavigationTransitionOptions
}

/**
 * @internal
 */
export interface NavigationState {
    current: number
    previous: number
}

/**
 * @internal
 */
export class Navigation extends React.Component<NavigationProps, NavigationState> implements Navigator {
    stack: NavigationItem[] = []
    activeTransition: NavigationTransitionOptions
    count = 0

    state = {
        current: -1,
        previous: -1,
    }

    componentDidMount() {
        if (this.stack.length === 0) {
            this.push(this.props.children, Transition.Instant)
        }
    }

    componentWillReceiveProps(props: NavigationProps) {
        this.stack[0].component = props["children"]
    }

    push = (
        Component: React.ReactNode,
        transition: NavigationTransitionOptions = Transition.PushLeft,
        transitionOverrides?: NavigationTransitionOptions
    ) => {
        // Don't push to the same Frame twice
        if (this.state && this.state.current) {
            const currentNavigationItem = this.stack[this.state.current]
            if (currentNavigationItem && currentNavigationItem.component === Component) {
                return
            }
        }

        if (transitionOverrides) {
            transition = { ...transition, ...transitionOverrides }
        }

        this.stack = this.stack.slice(0, this.state.current + 1)
        this.count++

        this.stack.push({
            key: `stack-${this.count++}`,
            component: Component,
            transition: transition,
        })

        this.setState({
            current: Math.min(this.state.current + 1, this.stack.length - 1),
            previous: this.state.current,
        })
    }

    goBack = () => {
        if (this.state.current === 0 || !this.state) return
        this.setState({ current: this.state.current - 1, previous: this.state.current })
    }

    instant = (Component: React.ReactNode) => {
        this.push(Component, Transition.Instant)
    }

    fade = (Component: React.ReactNode) => {
        this.push(Component, Transition.Fade)
    }

    pushLeft = (Component: React.ReactNode) => {
        this.push(Component, Transition.PushLeft)
    }

    pushRight = (Component: React.ReactNode) => {
        this.push(Component, Transition.PushRight)
    }

    pushDown = (Component: React.ReactNode) => {
        this.push(Component, Transition.PushDown)
    }

    pushUp = (Component: React.ReactNode) => {
        this.push(Component, Transition.PushUp)
    }

    modal = (Component: React.ReactNode, overrides?: NavigationTransitionOptions) => {
        this.push(Component, Transition.Modal, overrides)
    }

    overlayTop = (Component: React.ReactNode, overrides?: NavigationTransitionOptions) => {
        this.push(Component, Transition.OverlayTop, overrides)
    }

    overlayBottom = (Component: React.ReactNode, overrides?: NavigationTransitionOptions) => {
        this.push(Component, Transition.OverlayBottom, overrides)
    }

    overlayLeft = (Component: React.ReactNode, overrides?: NavigationTransitionOptions) => {
        this.push(Component, Transition.OverlayLeft, overrides)
    }

    overlayRight = (Component: React.ReactNode, overrides?: NavigationTransitionOptions) => {
        this.push(Component, Transition.OverlayRight, overrides)
    }

    flipUp = (Component: React.ReactNode) => {
        this.push(Component, Transition.FlipUp)
    }

    flipDown = (Component: React.ReactNode) => {
        this.push(Component, Transition.FlipDown)
    }

    flipLeft = (Component: React.ReactNode) => {
        this.push(Component, Transition.FlipLeft)
    }

    flipRight = (Component: React.ReactNode) => {
        this.push(Component, Transition.FlipRight)
    }

    contextSize(): Size {
        const width = this.props.width || 100
        const height = this.props.height || 100
        return { width, height }
    }

    contentSize(containerIndex: number, contextSize: Size): Size {
        const navigationItem = this.stack[containerIndex]
        if (navigationItem && navigationItem.component) {
            const { component } = navigationItem
            const rect = rectFromReactNode(component)
            if (rect) {
                if (navigationItem.transition.fitWidth !== false) rect.width = contextSize.width
                if (navigationItem.transition.fitHeight !== false) rect.height = contextSize.height
                return rect
            }
        }

        return contextSize
    }

    initialPropsForContainer(containerIndex: number, contextSize: Size, contentSize: Size): Partial<FrameProperties> {
        const navigationItem = this.stack[containerIndex]
        navigationItem.component

        if (navigationItem && navigationItem.transition && navigationItem.transition.inStart) {
            return navigationItem.transition.inStart(contextSize, contentSize)
        }
        return { left: 0 }
    }

    transitionPropsForContainer(
        containerIndex: number,
        contextSize: Size,
        contentSize: Size
    ): Partial<FrameProperties> {
        const { current } = this.state

        if (containerIndex === current) {
            // current
            const navigationItem = this.stack[containerIndex]
            if (navigationItem && navigationItem.transition) {
                if (navigationItem.transition.inEnd) {
                    return navigationItem.transition.inEnd(contextSize, contentSize)
                }
            }
            return { left: 0, top: 0 } // default current
        } else if (containerIndex < current) {
            // old
            const navigationItem = this.stack[containerIndex + 1]
            if (navigationItem && navigationItem.transition) {
                if (navigationItem.transition.outEnd) {
                    return navigationItem.transition.outEnd(contextSize, contentSize)
                }
            }
            return { left: 0, top: 0 } // default old
        } else {
            // future
            const navigationItem = this.stack[containerIndex]
            if (navigationItem && navigationItem.transition) {
                if (navigationItem.transition.inStart) {
                    return navigationItem.transition.inStart(contextSize, contentSize)
                }
            }
            return { left: 0, top: 0 } // default future
        }
    }

    transitionDurationForContainer(containerIndex: number) {
        const { previous, current } = this.state
        if (containerIndex !== previous && containerIndex !== current) return 0

        let navigationItem: NavigationItem | undefined

        if (current > previous) {
            navigationItem = this.stack[current]
        } else {
            navigationItem = this.stack[previous]
        }

        if (
            navigationItem &&
            navigationItem.transition &&
            isFiniteNumber(navigationItem.transition.transitionDuration)
        ) {
            return navigationItem.transition.transitionDuration
        }

        return 0.5 // default
    }

    containerIsVisible = (containerIndex: number) => {
        const { previous, current } = this.state
        if (containerIndex > current && containerIndex > previous) return false
        if (containerIndex === current || containerIndex === previous) return true
        // containerIndex is smaller then previous or current
        const nextNavigationItem = this.stack[containerIndex]
        return nextNavigationItem && nextNavigationItem.transition.overCurrentContext === true
    }

    containerShouldHideAfterTransition = (containerIndex: number) => {
        const { previous, current } = this.state
        if (containerIndex !== previous) return false
        if (containerIndex > current) {
            return true
        } else {
            const navigationItem = this.stack[current]
            return !navigationItem || navigationItem.transition.overCurrentContext !== true
        }
    }

    containerContent = (item: NavigationItem, index: number) => {
        return React.Children.map(item.component, child => {
            if (typeof child === "string" || typeof child === "number" || child === null) {
                return child
            }
            const update: Partial<{ top: number; left: number; width: number; height: number }> = { top: 0, left: 0 }
            const fitWidth = item.transition.fitWidth !== false
            const fitHeight = item.transition.fitHeight !== false
            if (fitWidth) update.width = this.props.width
            if (fitHeight) update.height = this.props.height
            return React.cloneElement(child, update)
        })
    }

    render() {
        const contextSize = this.contextSize()
        return (
            <Frame {...this.props} background={null} overflow={"hidden"}>
                <NavigatorContext.Provider value={this}>
                    {this.stack.map((item, containerIndex) => {
                        const contentSize = this.contentSize(containerIndex, contextSize)
                        const hideAfterTransition = this.containerShouldHideAfterTransition(containerIndex)
                        return (
                            <NavigationContainer
                                key={item.key}
                                contextSize={contextSize}
                                contentSize={contentSize}
                                initialProps={this.initialPropsForContainer(containerIndex, contextSize, contentSize)}
                                transitionProps={this.transitionPropsForContainer(
                                    containerIndex,
                                    contextSize,
                                    contentSize
                                )}
                                animationDuration={this.transitionDurationForContainer(containerIndex)}
                                visible={this.containerIsVisible(containerIndex)}
                                hideAfterTransition={hideAfterTransition}
                                backdropColor={item.transition.backdropColor}
                                onTapBackdrop={
                                    item.transition.goBackOnTapOutside && !hideAfterTransition ? this.goBack : undefined
                                }
                            >
                                {this.containerContent(item, containerIndex)}
                            </NavigationContainer>
                        )
                    })}
                </NavigatorContext.Provider>
            </Frame>
        )
    }
}
