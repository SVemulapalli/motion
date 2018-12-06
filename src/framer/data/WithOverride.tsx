import * as React from "react"
import { FrameProperties } from "../components/Frame"
import { DataObserverContext } from "./DataObserver"
const hoistNonReactStatic = require("hoist-non-react-statics")

export type OverrideObject<T extends object = any> = Partial<T>
export type OverrideFunction<P extends object = any> = (props: P) => Partial<P>
export type Override<T extends object = FrameProperties & { [key: string]: any }> =
    | OverrideObject<T>
    | OverrideFunction<T>

/**
 * @internal
 */
export function WithOverride<T extends object>(Component: React.ComponentType<T>, override: Override<T>) {
    const withOverride = function(props: T) {
        return (
            <DataObserverContext.Consumer>
                {() => {
                    let overrideProps: Partial<T>
                    if (typeof override === "function") {
                        overrideProps = override(props)
                    } else {
                        overrideProps = override
                    }
                    return <Component {...props} {...overrideProps} />
                }}
            </DataObserverContext.Consumer>
        )
    }
    hoistNonReactStatic(withOverride, Component)
    return withOverride
}
