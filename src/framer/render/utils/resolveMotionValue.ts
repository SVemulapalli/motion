import { isMotionValue } from "./isMotionValue"
import { MotionValue } from "../../../"

export const resolveMotionValue = <T>(value: T | MotionValue<T> | null | undefined, defaultValue: T): T => {
    if (!value) return defaultValue
    if (isMotionValue(value)) return value.get()
    return value
}

export const resolveMotionNumber = (
    value: number | MotionValue<number> | null | undefined,
    defaultValue: number = 0
): number => {
    return resolveMotionValue(value, defaultValue)
}
