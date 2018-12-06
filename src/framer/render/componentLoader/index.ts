// Note: React is imported here to re-export to script.
import * as React from "react"
import * as ReactDOM from "react-dom"

import {
    ComponentDefinition,
    ComponentIdentifier,
    DesignComponentDefinition,
    ErrorDefinition,
    PackageIdentifier,
    isDesignDefinition,
    isErrorDefinition,
} from "./definition"
import { warn, cleanFileName } from "./utils"
import { Package, componentsFromPackage, getPackageDisplayName, localPackageFallbackIdentifier } from "./package"

export * from "./definition"

/**
 * @ internal
 */
export interface ComponentLoader {
    /**
     * @internal
     */
    packageDisplayName(packageId: PackageIdentifier): string | undefined
    /**
     * @internal
     */
    localPackageIdentifier(): PackageIdentifier
    /**
     * @internal
     */
    packageIdentifiers(): PackageIdentifier[]
    /**
     * @internal
     */
    componentsForPackage(identifier: string): ComponentDefinition[]
    /**
     * @internal
     */
    componentForIdentifier(identifier: ComponentIdentifier): ComponentDefinition | null
    /**
     * @internal
     */
    errorForIdentifier(identifier: ComponentIdentifier): ErrorDefinition | null
    /**
     * @internal
     */
    componentIdentifiers(): ComponentIdentifier[]
    /**
     * @internal
     */
    forEachDesignComponents(cb: (component: DesignComponentDefinition) => void): void
    /**
     * @internal
     */
    forEachComponent(cb: (component: ComponentDefinition) => boolean): void
}

// TODO: Don't store state globally.
/**
 * @internal
 */
export const componentLoader: ComponentLoader = {
    packageDisplayName: (packageId: PackageIdentifier): string | undefined => {
        return undefined
    },
    localPackageIdentifier: () => {
        return localPackageFallbackIdentifier
    },
    packageIdentifiers: (): PackageIdentifier[] => {
        return []
    },
    componentsForPackage: (identifier: PackageIdentifier) => {
        return []
    },
    componentForIdentifier: (identifier: ComponentIdentifier) => {
        return null
    },
    errorForIdentifier: (identifier: ComponentIdentifier) => {
        return null
    },
    componentIdentifiers: () => {
        return []
    },
    forEachDesignComponents: (cb: (component: DesignComponentDefinition) => void): void => {},
    forEachComponent: (cb: (component: ComponentDefinition) => boolean): void => {},
}

/**
 * @internal
 */
export function componentIdentifierForMasterId(masterid: string, packageName: string): string {
    return packageName + "/" + packageName + "-" + masterid
}

/**
 * @internal
 */
export function updateComponentLoader(script: string, framer: any) {
    updateComponentLoaderWithScript(script, framer)
}

export function updateComponentLoaderWithScript(script: string, framer: any) {
    // A special require function with the dependencies we'd like to feed.
    const require = (name: string) => {
        if (name === "react") return React
        if (name === "react-dom" || name === "ReactDOM") return ReactDOM
        if (name === "framer") return framer
        if (name === "framer/resource") return {} // not a real module, tricked by our webpack compiler
        throw Error(`Component loader: Can't require ${name}`)
    }

    // NOTE: In Electron, module variable exists and resolves to index.debug.html.
    const fn = new Function("module", "exports", "require", script)
    const mod: { exports: Package } = { exports: {} }
    try {
        fn(mod, mod.exports, require)
    } catch (error) {
        warn("[component loader] reload error", error)
        return
    }
    const packageExports = mod.exports

    const componentMap = componentsFromPackage(packageExports)
    const packageComponentMap: { [key: string]: ComponentDefinition[] } = {}

    for (const key of Object.keys(componentMap)) {
        const def = componentMap[key]
        if (isErrorDefinition(def)) {
            // We've already logged an error for this definition and can't use it.
            continue
        }
        const packageIdentifier = def.packageIdentifier
        if (!packageComponentMap[packageIdentifier]) {
            packageComponentMap[packageIdentifier] = []
        }
        packageComponentMap[packageIdentifier].push(def)
    }

    componentLoader.packageDisplayName = (packageId: PackageIdentifier) => {
        return getPackageDisplayName(packageId)
    }

    componentLoader.localPackageIdentifier = (): PackageIdentifier => {
        if (!packageExports.__framer__) return localPackageFallbackIdentifier
        const { packageJson } = packageExports.__framer__
        if (!packageJson) return localPackageFallbackIdentifier
        return packageJson.name || localPackageFallbackIdentifier
    }

    componentLoader.packageIdentifiers = (): PackageIdentifier[] => {
        return Object.keys(packageComponentMap)
    }

    componentLoader.componentsForPackage = (identifier: PackageIdentifier): ComponentDefinition[] => {
        return packageComponentMap[identifier] || []
    }

    componentLoader.componentForIdentifier = (identifier: ComponentIdentifier): ComponentDefinition | null => {
        const def = componentMap[identifier]
        if (!def || isErrorDefinition(def)) {
            return null
        }
        return def
    }

    componentLoader.errorForIdentifier = (identifier: ComponentIdentifier): ErrorDefinition | null => {
        const fileName = (/(.*?[.][tj]sx?)_.*/.exec(identifier) || ["", identifier])[1]
        if (!(fileName in componentMap)) {
            // The component doesn't exist, return that as error.
            // NOTE: In the current setup, it is not possible that the component is still
            // loading but if that is the case that will need to be detected here.
            const file = cleanFileName(fileName)
            const external = file.indexOf("/") >= 0
            return { error: "Component file does not exist.", file, external, fileDoesNotExist: true }
        }
        const def = componentMap[fileName]
        if (!isErrorDefinition(def)) {
            // This is a valid component definition.
            return null
        }
        return def
    }

    componentLoader.componentIdentifiers = (): ComponentIdentifier[] => {
        return Object.keys(componentMap)
    }

    componentLoader.forEachDesignComponents = (cb: (component: DesignComponentDefinition) => void): void => {
        for (const k in packageComponentMap) {
            for (const component of packageComponentMap[k]) {
                if (!isDesignDefinition(component)) continue
                cb(component)
            }
        }
    }

    componentLoader.forEachComponent = (cb: (component: ComponentDefinition) => boolean): void => {
        for (const k in packageComponentMap) {
            for (const component of packageComponentMap[k]) {
                const abort = cb(component)
                if (abort) {
                    break
                }
            }
        }
    }
}
