import { Animator } from "../Animator"
import { PrecalculatedAnimator } from "../PrecalculatedAnimator"
import { expectArray } from "../../../../test/matchers"
export { expectArray }
export function testAnimator(
    animator: Animator<number>,
    values: number[],
    from: number = 0,
    to: number = 1,
    delta: number = 0.25
) {
    const precalculatedAnimator = new PrecalculatedAnimator({ animator, delta })
    precalculatedAnimator.setFrom(from)
    precalculatedAnimator.setTo(to)
    const testValues: number[] = []
    while (!precalculatedAnimator.isFinished()) {
        const value = precalculatedAnimator.next(delta)
        testValues.push(value)
    }
    expectArray(testValues).toBeCloseTo(values)
}
