import { Override } from "../../data/WithOverride"
import { JSONObject } from "../types/JSONData"
import { PropertyControls } from "../types/PropertyControls"

/**
 * @internal
 */
export type ComponentIdentifier = string

/**
 * NOTE: Also defined as ComponentType in the Server project.
 * @internal
 */
export type ComponentType = "component" | "device" | "deviceHand" | "deviceSkin" | "master" | "override"

/**
 * @internal
 */
export type PackageIdentifier = string

/**
 * @internal
 */
export type ComponentDefinition<P = any> = {
    file: string
    /** Identifier of the package that contains this component (one package can contain multiple components). */
    packageIdentifier: string
    identifier: ComponentIdentifier
    name: string
    type: ComponentType
    /** True if installed as a dependency. */
    external: boolean

    class: React.ComponentType<P> | JSON | Override<any>
    properties?: PropertyControls<P>
    defaults?: P
}

/**
 * @internal
 */
export type ReactComponentDefinition<P = any> = ComponentDefinition<P> & { class: React.ComponentType<P> }

/**
 * @internal
 */
export type DesignComponentDefinition = ComponentDefinition & { class: JSONObject }

/**
 * @internal
 */
export function isDesignDefinition(d: ComponentDefinition): d is DesignComponentDefinition {
    return d.type === "master"
}

/**
 * @internal
 */
export function isNonUserFacing(d: ComponentDefinition): boolean {
    return d.type === "device" || d.type === "deviceSkin" || d.type === "deviceHand"
}

/**
 * @internal
 */
export function isOverride(d: ComponentDefinition): boolean {
    return d.type === "override"
}

/**
 * @internal
 */
export function isReactDefinition<P = any>(d: ComponentDefinition<P>): d is ReactComponentDefinition<P> {
    return d.type !== "master"
}

/**
 * @internal
 */
export type ErrorDefinition = {
    file: string
    external: boolean
    error: Error | string
    fileDoesNotExist?: boolean
}

/**
 * @internal
 */
export function isErrorDefinition(def: ComponentDefinition | ErrorDefinition): def is ErrorDefinition {
    return def !== undefined && (<ErrorDefinition>def).error !== undefined
}
