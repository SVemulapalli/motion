/**
 * @public
 */
interface Size {
    width: number
    height: number
}

/**
 * @public
 */
function Size(width: number, height: number) {
    return { width, height }
}

/**
 * @beta
 */
namespace Size {
    export const equals = (sizeA: Size | null, sizeB: Size | null) => {
        if (sizeA === sizeB) return true
        if (!sizeA || !sizeB) return false
        return sizeA.width === sizeB.width && sizeA.height === sizeB.height
    }

    // NOTE: keepAspectRatio only works if passing a toSize with only a width or height
    export const update = (fromSize: Size, toSize: Partial<Size>, keepAspectRatio = false) => {
        let { width, height } = fromSize
        const sizeRatio = width / height

        // Update from partial
        width = toSize.width !== undefined ? toSize.width : width
        height = toSize.height !== undefined ? toSize.height : height

        // Overwrite if we want and can keep the aspect ratio
        if (keepAspectRatio) {
            if (toSize.width === undefined && toSize.height !== undefined) {
                width = toSize.height * sizeRatio
            }
            if (toSize.width !== undefined && toSize.height === undefined && sizeRatio !== 0) {
                height = toSize.width / sizeRatio
            }
        }

        return { width, height }
    }

    export function subtract(sizeA: Size, sizeB: Size) {
        return {
            width: Math.max(0, sizeA.width - sizeB.width),
            height: Math.max(0, sizeA.height - sizeB.height),
        }
    }

    export const zero = Size(0, 0)

    export const isZero = function(size: Size) {
        return size === Size.zero || (size.width === 0 && size.height === 0)
    }

    export const defaultIfZero = function(width: number, height: number, size: Size) {
        if (isZero(size)) {
            return Size(width, height)
        } // else
        return size
    }
}

export { Size }
