import * as assert from "assert"

import { SetSizeAndPositionChildren } from "../presentation/SetSizeAndPositionChildren"
import { ControlType, PropertyControls, verifyPropertyControls } from "../types/PropertyControls"

import { ComponentDefinition, ComponentType, ErrorDefinition } from "./definition"
import { LazyMap, ObjectMap, cleanFileName, warn } from "./utils"

// We would want to use HardCodedCodeIdentifier here, but that's part of Vekter for now
const builtInCodeComponents = ["framer/Scroll", "framer/Page", "framer/Stack"]

export const localPackageFallbackIdentifier = "|local|" // Contains characters that do not exist in normal names

// TODO: Don't store state globally.
const packagesNamesMap: ObjectMap<string> = {}

interface PackageInfo {
    packageJson: PackageJson
    /** Indicates an editable package, key is the filename in “code” folder. */
    sourceModules?: LazyMap<SourceModule>
    dependencies?: LazyMap<Package>
}

interface SourceModule {
    __info__?: ComponentInfo[]
    error?: any
}

// TODO share a type with the Server here
type ComponentInfo = {
    name: string
    children: boolean
    type: ComponentType
}

type ComponentMap = ObjectMap<ComponentDefinition | ErrorDefinition>

export interface Package {
    __framer__?: PackageInfo // Automatically added to project and to dependencies
}

interface PackageJson {
    name?: string // Can be undefined for the local package
    framer?: {
        components?: ComponentInfo[]
        displayName?: string
    }
    design?: any
}

export function componentsFromPackage(
    packageExports: Package,
    isExternal: boolean = false,
    identifierPrefix: string = ""
): ComponentMap {
    const componentMap: ComponentMap = {}
    const packageInfo = packageExports.__framer__

    if (!packageInfo) {
        // No extra info, nothing we can do
        return {}
    } // else

    const { packageJson, sourceModules, dependencies } = packageInfo

    if (
        packageJson.framer &&
        packageJson.framer.displayName &&
        packageJson.name &&
        !packagesNamesMap[packageJson.name]
    ) {
        packagesNamesMap[packageJson.name] = packageJson.framer.displayName
    }

    let packageName = packageJson.name
    if (!isExternal && !packageName) {
        packageName = localPackageFallbackIdentifier
    }
    if (!packageName) {
        warn("[component loader] failed to identify package")
        return {} // If we can’t identify the package, we refuse to map. This will not happen unless something is broken.
    }

    // First look at the sourceModules
    if (sourceModules && Object.keys(sourceModules).length > 0) {
        for (const fileName of Object.keys(sourceModules)) {
            let moduleExports: SourceModule
            try {
                moduleExports = sourceModules[fileName]() || {}
            } catch (error) {
                moduleExports = { error }
            }

            if (moduleExports.error) {
                const { error } = moduleExports
                warn(`[component loader] error in file: '${fileName}'`, error)
                const file = cleanFileName(fileName)
                const def: ErrorDefinition = { error, file, external: isExternal }
                componentMap[`${identifierPrefix}${fileName}`] = def
                continue
            }

            Object.assign(
                componentMap,
                componentsFromExports(
                    packageName,
                    moduleExports,
                    moduleExports.__info__ || [],
                    `${identifierPrefix}${fileName}_`,
                    isExternal,
                    fileName
                )
            )
        }
    }
    // If not found, inspect the manual info
    // TODO: Merge manual info to find more properties
    else if (packageJson.framer && packageJson.framer.components) {
        Object.assign(
            componentMap,
            componentsFromExports(
                packageName,
                packageExports,
                packageJson.framer.components,
                identifierPrefix,
                isExternal
            )
        )
    }

    // Process dependencies for the main project package only
    if (!isExternal && dependencies) {
        for (const dependencyKey of Object.keys(dependencies)) {
            // TODO: Sandbox dependencies
            Object.assign(
                componentMap,
                componentsFromPackage(dependencies[dependencyKey](), true, `${identifierPrefix}${dependencyKey}/`)
            )
        }
    }

    if (isExternal && packageJson.design) {
        const masters = mastersFromPackage(packageJson.design, packageName)
        for (const master of masters) {
            const identifier = `${identifierPrefix}${master.id}`
            componentMap[identifier] = {
                identifier,
                packageIdentifier: packageName,
                name: master.name || "",
                class: master,
                type: "master",
                file: "design/document.json",
                external: true,
            }
        }
    }

    return componentMap
}

function componentsFromExports(
    packageIdentifier: string,
    exports: Package | SourceModule,
    componentsInfo: ComponentInfo[],
    baseIdentifier: string,
    external: boolean,
    sourceFile?: string
): ComponentMap {
    const componentMap = {}

    for (const componentInfo of componentsInfo) {
        const componentObject = exports[componentInfo.name]

        if (!componentObject) {
            // Component defined but not found in exports!
            continue
        } // else

        const componentDef = componentWithInfo(
            baseIdentifier,
            packageIdentifier,
            componentObject,
            componentInfo,
            external,
            sourceFile
        )
        componentMap[componentDef.identifier] = componentDef
    }

    return componentMap
}

function componentWithInfo(
    baseIdentifier: string,
    packageIdentifier: string,
    object: any,
    componentInfo: ComponentInfo,
    external: boolean,
    file: string = ""
): ComponentDefinition {
    const { name, children, type } = componentInfo
    let properties: PropertyControls<any> = {}
    if (typeof object.propertyControls === "object") {
        properties = verifyPropertyControls(object.propertyControls)
    }
    if (children && !properties["children"]) {
        properties["children"] = { title: "Content", type: ControlType.ComponentInstance }
    }
    let componentClass = object
    if (type === undefined || type === "component") {
        componentClass = SetSizeAndPositionChildren(componentClass)
    }
    return {
        identifier: `${baseIdentifier}${name}`,
        name,
        type,
        class: componentClass,
        properties,
        defaults: {}, // TODO
        file,
        external,
        packageIdentifier,
    }
}

/** Finds masters and nested masters, will rewrite images and code component references. */
export function findMasters(node: any, packageName: string, masters: any[]) {
    if (!node.id) return
    if (node.replicaInfo) return
    if (node.isExternalMaster && node.isExternalMaster !== packageName) return

    const children = node.children
    if (children instanceof Array) {
        for (let i = 0, il = children.length; i < il; i++) {
            findMasters(children[i], packageName, masters)
        }
    }

    if (node.isMaster === true) {
        const prefix = `${packageName}-${node.id}-`
        const master = updateJSONMaster(node, prefix, packageName, null)
        master.id = `${packageName}-${node.id}`
        master.isMaster = true
        master.isExternalMaster = packageName
        master.top = 0
        master.left = 0
        master.bottom = null
        master.right = null
        masters.push(master)
    }
}

export function getPackageDisplayName(packageId: string): string | undefined {
    return packagesNamesMap[packageId]
}

function mastersFromPackage(json: any, packageName: string) {
    const masters: any[] = []
    findMasters(json.root, packageName, masters)
    return masters
}

function updateJSONMaster(node: any, idPrefix: string, packageName: string, parentid: string | null): any {
    assert(!node.id.startsWith(idPrefix))

    const id = idPrefix + node.id
    let children: any = undefined
    if (node.children && Array.isArray(node.children)) {
        children = node.children.map((c: any) => updateJSONMaster(c, idPrefix, packageName, id))
    }

    const clone = { ...node, id, parentid, children, isMaster: false }
    if (clone.fillImage) {
        clone.fillImage = "node_modules/" + packageName + "/design/images/" + clone.fillImage
    }
    if (clone.codeComponentIdentifier && builtInCodeComponents.indexOf(clone.codeComponentIdentifier) === -1) {
        clone.codeComponentIdentifier = packageName + "/" + clone.codeComponentIdentifier
    }
    return clone
}
