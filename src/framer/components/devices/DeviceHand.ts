import { WithPackage } from "./WithPackage"

/**
 * @alpha
 */
export type DeviceHands = { [key: string]: DeviceHand | ExternalDeviceHand }

/**
 * @alpha
 */
export type DeviceHand = {
    image: string
    width: number
    height: number
    offset: number
}

/**
 * @alpha
 */
export type ExternalDeviceHand = WithPackage & Partial<DeviceHand>
