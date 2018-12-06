import { Animatable } from "../../animation/Animatable"
import { AnyInterpolation, Interpolation } from "../"
import { Color } from "../../render"
import { expectObject } from "../../../test/matchers"
import { ValueInterpolation } from "../ValueInterpolation"
import { ObjectInterpolation } from "../ObjectInterpolation"
import { NoInterpolation } from "../NoInterpolation"

describe("AnyInterpolation", () => {
    it("should work with number", () => {
        const interpolator = AnyInterpolation.interpolate(10, 90)
        expect(interpolator(0)).toBe(10)
        expect(interpolator(0.5)).toBe(50)
        expect(interpolator(1)).toBe(90)
    })
    it("should work with boolean", () => {
        const interpolator = AnyInterpolation.interpolate(false, true)
        expect(interpolator(0)).toBe(false)
        expect(interpolator(0.5)).toBe(true)
        expect(interpolator(1)).toBe(true)
    })
    it("should work with object", () => {
        const from = { x: 10, y: true, a: Animatable(3) }
        const to = { x: 90, y: false, a: Animatable(7) }
        const interpolator = AnyInterpolation.interpolate(from, to)
        expect(interpolator(0)).toEqual({ x: 10, y: true, a: Animatable(3) })
        expect(interpolator(0.5)).toEqual({ x: 50, y: false, a: Animatable(5) })
        expect(interpolator(1)).toEqual({ x: 90, y: false, a: Animatable(7) })
    })
    it("should work with Color", () => {
        const from = Color({ r: 10, g: 20, b: 30 })
        const to = Color({ r: 100, g: 200, b: 0 })
        const interpolator = AnyInterpolation.interpolate(from, to)
        expectObject(interpolator(0)).toBeCloseTo(Color({ r: 10, g: 20, b: 30 }))
        expectObject(interpolator(0.5)).toBeCloseTo(Color({ r: 40.47, g: 101.55, b: 95.74 }))
        expectObject(interpolator(1)).toBeCloseTo(Color({ r: 100, g: 200, b: 0 }))
    })
    it("should work with Animatable", () => {
        const from = Animatable(10)
        const to = Animatable(90)
        const interpolator = AnyInterpolation.interpolate(from, to)
        expect(interpolator(0).get()).toBe(10)
        expect(interpolator(0.5).get()).toBe(50)
        expect(interpolator(1).get()).toBe(90)
    })

    it("should prevent a custom interpolation from returning AnyInterpolation", () => {
        class Test {
            constructor(public value: number) {}
            static interpolationFor<Value>(
                value: any,
                currentInterpolation: Interpolation<any>
            ): Interpolation<Test> | undefined {
                return AnyInterpolation
            }
        }
        const test1 = new Test(1)
        const test2 = new Test(3)
        const interpolator = AnyInterpolation.interpolate(test1, test2)
        expect(interpolator(0).value).toEqual(1)
        expect(interpolator(0.3).value).toEqual(1.6)
        expect(interpolator(1).value).toEqual(3)
    })

    it("should prevent a custom interpolation from returning new ValueInterpolation()", () => {
        class Test {
            constructor(public value: number) {}
            static interpolationFor<Value>(
                value: any,
                currentInterpolation: Interpolation<any>
            ): Interpolation<Test> | undefined {
                return new ValueInterpolation()
            }
        }
        const test1 = new Test(1)
        const test2 = new Test(3)
        const interpolator = AnyInterpolation.interpolate(test1, test2)
        expect(interpolator(0).value).toEqual(1)
        expect(interpolator(0.3).value).toEqual(1.6)
        expect(interpolator(1).value).toEqual(3)
    })

    it("should allow a custom interpolation to return a subclass of ValueInterpolation", () => {
        class Custom extends ValueInterpolation {
            interPolationForValue(value: any): Interpolation {
                return ObjectInterpolation(NoInterpolation)
            }
        }
        class Test {
            constructor(public value: number) {}
            static interpolationFor<Value>(
                value: any,
                currentInterpolation: Interpolation<any>
            ): Interpolation<Test> | undefined {
                return new Custom()
            }
        }
        const test1 = new Test(1)
        const test2 = new Test(3)
        const interpolator = AnyInterpolation.interpolate(test1, test2)
        expect(interpolator(0).value).toEqual(1)
        expect(interpolator(0.3).value).toEqual(1)
        expect(interpolator(0.6).value).toEqual(3)
        expect(interpolator(1).value).toEqual(3)
    })
})
