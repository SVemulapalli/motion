import { Animatable } from "../Animatable"
import { Spring } from "../Animators"
import { TestAnimationDriver, AsyncTestAnimationDriver } from "../Drivers/TestDriver"
import { FramerAnimation } from "../FramerAnimation"
import { Bezier, BezierAnimator } from "../Animators/BezierAnimator"
import { expectArray } from "../Animators/__tests__/animatorTestUtils"
const options = { curve: Bezier.Linear }

describe("Animation", () => {
    it("should animate a value linearly", () => {
        const value = Animatable(0)
        const values = []
        const handler = jest.fn(value => {
            values.push(value)
        })
        const animation = new FramerAnimation(value, 0, 16, BezierAnimator, options, TestAnimationDriver)
        value.onUpdate(handler)
        animation.play()
        expect(value.get()).toEqual(16)
        expect(handler).toHaveBeenCalledTimes(17)
        expectArray(values.map(value => value.value)).toBeCloseTo(
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16],
            0
        )
    })
    it("should animate a value with precalculation", () => {
        const value = Animatable(0)
        const values = []
        const handler = jest.fn(value => {
            values.push(value)
        })
        const animation = new FramerAnimation(value, 0, 16, BezierAnimator, options, TestAnimationDriver)
        value.onUpdate(handler)
        animation.play()
        expect(value.get()).toEqual(16)
        expect(handler).toHaveBeenCalledTimes(17)
        expectArray(values.map(v => v.value)).toBeCloseTo(
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 16],
            0
        )
    })
    it("should call the callback function when it is finished", () => {
        const value = Animatable(0)
        const values = []
        const animation = new FramerAnimation(value, 0, 16, BezierAnimator, options, TestAnimationDriver)
        const callback = jest.fn(() => {})
        animation.onfinish = callback
        animation.play()
        expect(callback).toHaveBeenCalled()
    })
    it("should NOT call the callback directly when the animation is already finished", () => {
        // changed, since this not the expected behavior for "onfinished" mimicking the Web Animation API:
        const value = Animatable(0)
        const values = []
        const animation = new FramerAnimation(value, 0, 16, BezierAnimator, options, TestAnimationDriver)
        const callback = jest.fn(() => {})
        animation.play()
        expect(callback).not.toHaveBeenCalled()
        animation.onfinish = callback
        expect(callback).not.toHaveBeenCalled()
    })
    it.skip("should not call the callback when the animation is cancelled", () => {})

    it("should resolve the finished promise when it is finished", done => {
        const value = Animatable(0)
        const values = []
        const animation = new FramerAnimation(value, 0, 16, BezierAnimator, options, TestAnimationDriver)
        const callback = jest.fn(() => {
            done()
        })
        animation.finished.then(callback)
        animation.play()
    })
    it("should resolve the finished promise when it is finished manually", done => {
        const value = Animatable(0)
        const values = []
        const animation = new FramerAnimation(value, 0, 16, BezierAnimator, options, AsyncTestAnimationDriver)
        const callback = jest.fn(() => {
            done()
        })
        animation.finished.then(callback)
        animation.play()
        animation.finish()
    })
    it("should reject the finished promise when cancelled", done => {
        const value = Animatable(0)
        const values = []
        const animation = new FramerAnimation(value, 0, 16, BezierAnimator, options, AsyncTestAnimationDriver)
        const callback = jest.fn(() => {
            done()
        })
        animation.finished.then(null, callback)
        animation.play()
        animation.cancel()
    })
})
