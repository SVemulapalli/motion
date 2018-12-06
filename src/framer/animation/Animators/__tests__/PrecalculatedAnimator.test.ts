import { PrecalculatedAnimator } from "../PrecalculatedAnimator"
import { Animator } from "../Animator"
import { BezierAnimator, Bezier } from "../BezierAnimator"
import { expectArray } from "./animatorTestUtils"
import { NumberInterpolation } from "../../../interpolation"
import { ObjectInterpolation } from "../../../interpolation"

class MockAnimator implements Animator<number, null> {
    private values: number[]
    private index = 0
    constructor(values: number[]) {
        this.values = values
    }
    setFrom(value: number) {}
    setTo(value: number) {}

    isReady() {
        return true
    }

    next(delta: number): number {
        const value = this.values[this.index]
        this.index++
        return value
    }

    isFinished(): boolean {
        return this.index >= this.values.length
    }
}

describe("PrecalculatedAnimator", () => {
    it("should iterate over a basic animator", () => {
        const values = [1, 2, 3, 4, 5]
        const animator = new MockAnimator(values)
        const precalculatedAnimator = new PrecalculatedAnimator({ animator: animator })
        precalculatedAnimator.setFrom(1) // Needed to trigger precalculation
        const testValues: number[] = []
        while (!precalculatedAnimator.isFinished()) {
            testValues.push(precalculatedAnimator.next(1 / 60))
        }
        expect(testValues).toEqual(values)
    })
    it("should handle an 'empty' animator correctly", () => {
        const values = []
        const animator = new MockAnimator(values)
        const precalculatedAnimator = new PrecalculatedAnimator({ animator: animator })
        precalculatedAnimator.setFrom(1) // Needed to trigger precalculation
        const testValues: number[] = []
        while (!precalculatedAnimator.isFinished()) {
            testValues.push(precalculatedAnimator.next(1 / 60))
        }
        expect(testValues).toEqual(values)
    })
    it("should limit the precalculations it does", () => {
        const values = [1, 2, 3, 4, 5]
        const animator = new MockAnimator(values)
        const precalculatedAnimator = new PrecalculatedAnimator({ animator: animator, maxValues: 2 })
        precalculatedAnimator.setFrom(1) // Needed to trigger precalculation
        const testValues: number[] = []
        while (!precalculatedAnimator.isFinished()) {
            testValues.push(precalculatedAnimator.next(1 / 60))
        }
        expect(testValues).toEqual([1, 2])
    })
    it("should handle the calling it with a different delta correctly", () => {
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const animator = new MockAnimator(values)
        const precalculatedAnimator = new PrecalculatedAnimator({ animator: animator, delta: 1 / 120 })
        precalculatedAnimator.setFrom(1) // Needed to trigger precalculation
        const testValues: number[] = []
        while (!precalculatedAnimator.isFinished()) {
            testValues.push(precalculatedAnimator.next(1 / 60))
        }
        expect(testValues).toEqual([2, 4, 6, 8, 10])
    })
    it("should handle rounded lookups", () => {
        const animator = new BezierAnimator<number>({ curve: Bezier.Linear }, NumberInterpolation)
        const precalculatedAnimator = new PrecalculatedAnimator({ animator: animator })
        precalculatedAnimator.setFrom(0)
        precalculatedAnimator.setTo(1)
        const testValues: number[] = []
        let progress = 0
        while (!precalculatedAnimator.isFinished()) {
            testValues.push(precalculatedAnimator.next(0.25))
        }
        expectArray(testValues).toBeCloseTo([0.25, 0.5, 0.75, 1])
    })
    it("should work with objects", () => {
        const animator = new BezierAnimator<{ x: number; y: number }>(
            { curve: Bezier.Linear },
            ObjectInterpolation(NumberInterpolation)
        )
        const precalculatedAnimator = new PrecalculatedAnimator({ animator: animator })
        precalculatedAnimator.setFrom({ x: 0, y: 1 })
        precalculatedAnimator.setTo({ x: 1, y: 0 })
        const testValues = []
        let progress = 0
        while (!precalculatedAnimator.isFinished()) {
            testValues.push(precalculatedAnimator.next(1 / 60))
        }
        expect(testValues[0]).toEqual({ x: 0.017865964231539442, y: 0.9821340357684606 })
        expect(testValues[Math.round(testValues.length / 2)]).toEqual({ x: 0.5166639231824416, y: 0.4833360768175584 })
        const last = testValues[testValues.length - 1]
        expect(last.x).toBeCloseTo(1, 10)
        expect(last.y).toBeCloseTo(0, 10)
    })
})
