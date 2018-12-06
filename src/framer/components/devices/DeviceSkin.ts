import { WithPackage } from "./WithPackage"

/**
 * @internal
 */
export type DeviceSkins = { [key: string]: DeviceSkin | ExternalDeviceSkin }

/**
 * @internal
 */
export interface DeviceSkin {
    image: string
    imageWidth: number
    imageHeight: number
    padding: number
    background: string
}

/**
 * @internal
 */
export type ExternalDeviceSkin = WithPackage & Partial<DeviceSkin>
