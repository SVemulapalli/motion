import { Data } from "../Data"
import { Animatable, isAnimatable } from "../../animation/Animatable"

describe("Data", () => {
    it("should contain every key of the original object", () => {
        const initial = { a: 1, b: "test", c: true }
        const object = Data(initial)
        for (let key in initial) {
            expect(object[key]).toEqual(initial[key])
        }
    })

    it("should keep existing animatable values, but not create new ones", () => {
        const test = Animatable(10)
        const initial = { test, c: "5" }
        const object = Data(initial)
        expect(object.test).toBe(test)
        expect(test.get()).toEqual(10)
        expect(isAnimatable(object.c)).toBeFalsy()
    })

    it("should fire an update when setting a property", () => {
        const store = Data({ bla: 4 })
        const handler = jest.fn(() => {})
        Data.addObserver(store, handler)
        store.bla = 10
        expect(handler).toHaveBeenCalledWith({ value: store }, undefined)
    })

    it("should not fire an update when changing an animatable value", () => {
        const test = Animatable(10)
        const store = Data({ test })
        const handler = jest.fn(() => {})
        Data.addObserver(store, handler)
        test.set(20)
        expect(handler).not.toHaveBeenCalled()
    })

    it("should set an animatable object, even if we use the property setter", () => {
        const animatable = Animatable(1)
        const store = Data({ animatable })
        // store.animatable.set(10)
        store.animatable = 10
        expect(animatable.get()).toBe(10)
    })

    it("should set the value to the value of an animatable object", () => {
        const animatable = Animatable(1)
        const value = 1
        const store = Data({ animatable, value })
        store.animatable = Animatable(10)
        expect(animatable.get()).toBe(10)
        store.value = Animatable(10)
        expect(store.value).toBe(10)
    })
})
