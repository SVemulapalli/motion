import { BezierAnimator, Bezier } from "../BezierAnimator"
import { testAnimator } from "./animatorTestUtils"
import { AnyInterpolation } from "../../../interpolation"

describe("BezierAnimator", () => {
    it("should handle a basic linear animation", () => {
        const animator = new BezierAnimator<number>({ curve: Bezier.Linear }, AnyInterpolation)
        const values = [0.25, 0.5, 0.75, 1]
        testAnimator(animator, values)
    })

    it("should handle a animation with control points", () => {
        const animator = new BezierAnimator<number>({ curve: [0, 0, 1, 1] }, AnyInterpolation)
        const values = [0.25, 0.5, 0.75, 1]
        testAnimator(animator, values)
    })

    it("should handle a different duration", () => {
        const duration = 3
        const animator = new BezierAnimator<number>({ curve: Bezier.Linear, duration }, AnyInterpolation)
        const values = [0.25, 0.5, 0.75, 1]
        testAnimator(animator, values, 0, 1, duration / 4)
    })

    it("should handle a different range", () => {
        const duration = 3
        const animator = new BezierAnimator<number>({ curve: Bezier.Linear, duration }, AnyInterpolation)
        const values = [0, 1, 2, 3]
        testAnimator(animator, values, -1, 3, duration / 4)
    })

    it("should handle an ease animation", () => {
        const animator = new BezierAnimator<number>({ curve: Bezier.Ease }, AnyInterpolation)
        const values = [0.42, 0.81, 0.96, 1]
        testAnimator(animator, values)
    })
})
