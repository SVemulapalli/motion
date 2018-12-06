import { ObservableObject } from "../ObservableObject"
import { Animatable, isAnimatable } from "../../animation/Animatable"

describe("ObservableObject", () => {
    it("should make every key animatable", () => {
        const initial = { a: 1, b: "test", c: true }
        const object = ObservableObject(initial, true)
        for (let key in initial) {
            expect(object[key].get()).toEqual(initial[key])
        }
    })

    it("should keep existing animatable values", () => {
        const test = Animatable(10)
        const initial = { test, c: "5" }
        const object = ObservableObject(initial, true)
        expect(object.test).toBe(test)
        expect(test.get()).toEqual(10)
        expect(isAnimatable(object.c)).toBeTruthy()
    })

    it("should fire an update when setting a property", () => {
        const store = ObservableObject({ bla: 4 })
        const handler = jest.fn(() => {})
        ObservableObject.addObserver(store, handler)
        store.bla = 10
        expect(handler).toHaveBeenCalledWith({ value: store }, undefined)
    })

    it("should fire an update when changing an animatable value", () => {
        const test = Animatable(10)
        const store = ObservableObject({ test }, true)
        const handler = jest.fn(() => {})
        ObservableObject.addObserver(store, handler)
        test.set(20)
        expect(handler).toHaveBeenCalledWith({ value: store }, undefined)
    })

    it("should fire an update when changing an animatable value, even when the store is not animatable", () => {
        const test = Animatable(10)
        const store = ObservableObject({ test })
        const handler = jest.fn(() => {})
        ObservableObject.addObserver(store, handler)
        test.set(20)
        expect(handler).toHaveBeenCalledWith({ value: store }, undefined)
    })

    it("should only fire once when updating values in a transaction", () => {
        const value1 = Animatable(0)
        const value2 = Animatable(1)
        const store = ObservableObject({ value1, value2 })
        const handler = jest.fn(() => {})
        ObservableObject.addObserver(store, handler)
        let transaction = undefined
        Animatable.transaction((update, transactionId) => {
            transaction = transactionId
            update(value1, 2)
            update(value2, 3)
        })
        expect(handler).toHaveBeenCalledTimes(1)
        expect(handler).toHaveBeenCalledWith({ value: store }, transaction)
    })

    it("should fire for every observable object in a transaction", () => {
        const value1 = Animatable(0)
        const value2 = Animatable(1)
        const observable = ObservableObject({ value1, value2 })
        const observable2 = ObservableObject({ value1, value2 })
        const handler = jest.fn(() => {})
        const handler2 = jest.fn(() => {})
        ObservableObject.addObserver(observable, handler)
        ObservableObject.addObserver(observable2, handler2)
        let transaction = undefined
        Animatable.transaction((update, transactionId) => {
            transaction = transactionId
            update(value1, 2)
            update(value2, 3)
        })
        expect(handler).toHaveBeenCalledTimes(1)
        expect(handler).toHaveBeenCalledWith({ value: observable }, transaction)
        expect(handler2).toHaveBeenCalledTimes(1)
        expect(handler2).toHaveBeenCalledWith({ value: observable2 }, transaction)
    })

    it("should set an animatable object, even if we use the property setter", () => {
        const animatable = Animatable(1)
        const store = ObservableObject({ animatable })
        // store.animatable.set(10)
        store.animatable = 10
        expect(animatable.get()).toBe(10)
    })
    it("should set the value to the value of an animatable object", () => {
        const animatable = Animatable(1)
        const value = 1
        const store = ObservableObject({ animatable, value }, undefined)
        store.animatable = Animatable(10)
        store.value = Animatable(10)
        expect(animatable.get()).toBe(10)
        expect(store.value).toBe(10)
    })
})
