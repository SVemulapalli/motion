import { transform } from "../"
import { NoInterpolation } from "../"
import { ColorMixModelType } from "../../render/types/Color/types"
import { Color } from "../../render/types/Color"
import { expectObject } from "../../../test/matchers"
import { ColorInterpolation } from "../ColorInterpolation"
import { Animatable } from "../../animation/Animatable"

describe("transform", () => {
    it("should transform two simple numbers", () => {
        const transformer = transform([0, 10], [0, 100])
        expect(transformer(0)).toEqual(0)
        expect(transformer(5)).toEqual(50)
        expect(transformer(10)).toEqual(100)
    })
    it("should work with negative values", () => {
        const transformer = transform([0, 5], [-5, 0])
        expect(transformer(0)).toEqual(-5)
        expect(transformer(2)).toEqual(-3)
        expect(transformer(5)).toEqual(0)
    })
    it("should work with 0 values", () => {
        let transformer = transform([0, 0], [0, 0])
        expect(transformer(0)).toEqual(0)
        expect(transformer(-1)).toEqual(0)
        expect(transformer(1)).toEqual(0)
        transformer = transform([0, 0], [1, 2])
        expect(transformer(0)).toEqual(1)
        expect(transformer(-1)).toEqual(1)
        expect(transformer(1)).toEqual(1)
    })
    it("should work with the same values", () => {
        const transformer = transform([123, 456], [123, 456])
        expect(transformer(0)).toEqual(0)
        expect(transformer(20)).toBeCloseTo(20)
        expect(transformer(123)).toEqual(123)
        expect(transformer(200)).toEqual(200)
        expect(transformer(456)).toEqual(456)
    })
    it("should work custom input interpolation", () => {
        const transformer = transform([2, 3], [200, 300], { inputInterpolation: NoInterpolation })
        expect(transformer(2)).toEqual(200)
        // Everything other that 2 should return 300
        expect(transformer(-1)).toEqual(300)
        expect(transformer(2.5)).toEqual(300)
        expect(transformer(3)).toEqual(300)
        expect(transformer(4)).toEqual(300)
    })
    it("should work custom output interpolation", () => {
        const transformer = transform([2, 3], [200, 300], { outputInterpolation: NoInterpolation })
        expect(transformer(-1)).toEqual(200)
        expect(transformer(2)).toEqual(200)
        expect(transformer(2.4)).toEqual(200)
        expect(transformer(2.5)).toEqual(300)
        expect(transformer(3)).toEqual(300)
        expect(transformer(4)).toEqual(300)
    })

    it("should limit correctly", () => {
        const transformer = transform([-20, 20], [1, 2], { limit: true })
        expect(transformer(-30)).toEqual(1)
        expect(transformer(30)).toEqual(2)
    })

    it("should work with simple objects", () => {
        const transformer = transform(
            [0, 10],
            [{ color: Color("red"), number: 10, boolean: false }, { color: Color("green"), number: 30, boolean: true }]
        )
        const colorInterpolation = ColorInterpolation().interpolate(Color("red"), Color("green"))
        const start = transformer(0)
        expectObject(start.color).toBeCloseTo(colorInterpolation(0))
        expect(start.number).toEqual(10)
        expect(start.boolean).toEqual(false)
        const half = transformer(5)
        expectObject(half.color).toBeCloseTo(colorInterpolation(0.5))
        expect(half.number).toEqual(20)
        expect(half.boolean).toEqual(true)
        const end = transformer(10)
        expectObject(end.color).toBeCloseTo(colorInterpolation(1))
        expect(end.number).toEqual(30)
        expect(end.boolean).toEqual(true)
    })

    it("should work with objects as input", () => {
        const transformer = transform([{ a: 10, b: 40, c: 3 }, { a: 30, b: -10, c: 4 }], [0, 10])
        const start = transformer({ a: 10, b: 40, c: 3 })
        expect(start).toEqual(0)
        const half = transformer({ a: 20, b: 15, c: 3.5 })
        expect(half).toBeCloseTo(5)
        const end = transformer({ a: 30, b: -10, c: 4 })
        expect(end).toEqual(10)
    })

    it("should work with nested objects", () => {
        const transformer = transform(
            [-5, -10],
            [{ test: { a: 10, b: 40, c: 3 }, d: -100 }, { test: { a: 30, b: -10, c: 4 }, d: -110 }]
        )
        expect(transformer(0)).toEqual({ test: { a: -10, b: 90, c: 2 }, d: -90 })
        expect(transformer(-5)).toEqual({ test: { a: 10, b: 40, c: 3 }, d: -100 })
        expect(transformer(-7.5)).toEqual({ test: { a: 20, b: 15, c: 3.5 }, d: -105 })
        expect(transformer(-10)).toEqual({ test: { a: 30, b: -10, c: 4 }, d: -110 })
    })

    it("should work with undefined keys in objects", () => {
        const transformer = transform([0, 1], [{ a: 1, c: 3 }, { a: 4, b: 5 }])
        expect(transformer(0)).toEqual({ a: 1, b: 5, c: 3 })
        expect(transformer(0.5)).toEqual({ a: 2.5, b: 5, c: 3 })
        expect(transformer(1)).toEqual({ a: 4, b: 5, c: 3 })
    })

    it("should work with Animatables", () => {
        const transformer = transform([Animatable(1), Animatable(2)], [Animatable(3), Animatable(4)])
        expect(transformer(Animatable(1))).toEqual(Animatable(3))
        expect(transformer(Animatable(1.2))).toEqual(Animatable(3.2))
        expect(transformer(Animatable(2))).toEqual(Animatable(4))
    })

    it("should handle null values", () => {
        const transformer = transform([null, 1], [10, 20])
        expect(transformer(null)).toEqual(10)
        expect(transformer(1)).toEqual(20)
        expect(transformer(0.3)).toEqual(20)
    })

    it("should handle string values", () => {
        console.warn = jest.fn()
        const transformer = transform([0, 1], ["aap", "noot"])
        expect(console.warn).toHaveBeenCalledWith("No interpolation defined for aap")
        expect(transformer(0)).toEqual("aap")
        expect(transformer(0.3)).toEqual("aap")
        expect(transformer(1)).toEqual("noot")
    })
})

describe("transform.value", () => {
    it("should convert a simple value", () => {
        const value = transform.value(0.5, [0, 1], [20, 40])
        expect(value).toEqual(30)
    })
    it("should have a colorModel option", () => {
        const value = transform.value(0.5, [0, 1], ["red", "blue"], {
            colorModel: ColorMixModelType.RGB,
        })
        expect(value).toEqual(Color({ r: 127.5, g: 0, b: 127.5 }))
    })
    it("should give preference of interpolation above a colorModel", () => {
        const halfRedBlue = Color({ r: 127.5, g: 0, b: 127.5 })
        const value = transform.value(halfRedBlue, [Color("red"), Color("blue")], ["green", "yellow"], {
            colorModel: ColorMixModelType.RGB,
        })
        const customInterpolation = transform.value(halfRedBlue, [Color("red"), Color("blue")], ["green", "yellow"], {
            colorModel: ColorMixModelType.RGB,
            outputInterpolation: NoInterpolation,
        })
        expect(value).toEqual(Color({ r: 127.5, g: 191.5, b: 0 }))
        expect(customInterpolation).toEqual("yellow")
    })
})
