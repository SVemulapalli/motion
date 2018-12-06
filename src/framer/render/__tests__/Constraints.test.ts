import "jest"
import { ConstraintMask } from "../"
import { DimensionType } from "../types/Constraints"

describe("Constraints", () => {
    it("should be valid", () => {
        const original: ConstraintMask = {
            left: true,
            right: true,
            top: true,
            bottom: true,
            widthType: DimensionType.FixedNumber,
            heightType: DimensionType.FixedNumber,
            aspectRatio: null,
            fixedSize: false,
        }

        expect(ConstraintMask.quickfix({ ...original })).toEqual(original)
    })

    it("should be invalid", () => {
        const original: ConstraintMask = {
            left: true,
            right: true,
            top: true,
            bottom: true,
            widthType: DimensionType.Percentage, // not allowed together with left and right
            heightType: DimensionType.FixedNumber,
            aspectRatio: null,
            fixedSize: false,
        }
        expect(ConstraintMask.quickfix({ ...original })).not.toEqual(original)
    })
})
