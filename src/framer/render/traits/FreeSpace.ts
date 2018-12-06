import { Size } from "../types/Size"

// Implementing this interface implies that the width and/or height value can support "fr" values to consume free space in its parent.
/**
 * @public
 */
export interface WithFractionOfFreeSpace {
    /**
     * All free space in the parent, in px.
     * @internal
     */
    freeSpaceInParent: Size
    /**
     * The sum of all "fr" values in siblings wishing to consume free space. Each free space consuming child must divide its own "fr" value by this value.
     * @internal
     */
    freeSpaceUnitDivisor: Size
}
