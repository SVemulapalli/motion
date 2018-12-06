import * as React from "react"
import * as ReactDOM from "react-dom"
import { isEqual } from "../utils/isEqual"
import { RenderEnvironment, RenderTarget } from "../types/RenderEnvironment"

export interface IdentityProps extends React.Props<any> {
    id?: string
}

export interface LayerProps extends IdentityProps {
    willChangeTransform: boolean
    _forwardedOverrides?: { [key: string]: any }
}

/**
 * @beta
 */
export class Layer<P extends Partial<LayerProps>, S> extends React.Component<Partial<P>, S> {
    static defaultLayerProps: LayerProps = {
        willChangeTransform: !RenderTarget.hasRestrictions(),
    }

    shouldComponentUpdate(nextProps: P, nextState: S) {
        return this.state !== nextState || !isEqual(this.props, nextProps, false)
    }

    get properties(): P {
        // React takes care of this, as long as defaultProps are defined: https://reactjs.org/docs/react-component.html#defaultprops
        // Each subclass should have a defaultProps with type P
        return this.props as P
    }

    previousZoom = RenderEnvironment.zoom
    componentDidUpdate(prevProps: P) {
        const { zoom } = RenderEnvironment
        // Workarounds for WebKit bugs

        // Some styles have to be toggled to take effect in certain situations.
        // Not using type safety, uses lots of internal knowledge for efficiency

        if (zoom !== this.previousZoom && this.props["blendingMode"] && this.props["blendingMode"] !== "normal") {
            this.resetSetStyle("mixBlendMode", this.props["blendingMode"])
        }

        if (this.props["clip"] && this.props["radius"] === 0 && prevProps["radius"] !== 0) {
            this.resetSetStyle("overflow", "hidden", false)
        }
        this.previousZoom = zoom
    }

    protected resetSetStyle(key: string, toValue: any | null, microtask: boolean = true) {
        const element = ReactDOM.findDOMNode(this) as HTMLElement
        if (!element) {
            return
        }
        const value = toValue ? toValue : element.style[key]
        const reset = () => {
            element.style[key] = value
        }
        element.style[key] = null
        if (microtask) {
            Promise.resolve().then(reset)
        } else {
            setTimeout(reset, 0)
        }
    }
}
