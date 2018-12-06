import { Animatable } from "../Animatable"

describe("Animatable", () => {
    it("should hold the initial value", () => {
        const value = Animatable(10)
        expect(value.get()).toEqual(10)
    })

    it("should update the value", () => {
        const value = Animatable(1)
        value.set(2)
        expect(value.get()).toEqual(2)
    })

    it("should update a listener", () => {
        const value = Animatable(1)
        const handler = jest.fn((v: number): void => {})
        value.onUpdate(handler)
        value.set(2)
        expect(handler).toBeCalledWith({ value: 2, oldValue: 1 }, undefined)
    })
    it("should update multiple listeners", () => {
        const value = Animatable(1)
        const handler1 = jest.fn((): void => {})
        const handler2 = jest.fn((): void => {})
        value.onUpdate(handler1)
        value.onUpdate(handler2)
        value.set(2)
        expect(handler1).toBeCalledWith({ value: 2, oldValue: 1 }, undefined)
        expect(handler2).toBeCalledWith({ value: 2, oldValue: 1 }, undefined)
    })
    it("should remove a listener", () => {
        const value = Animatable(1)
        const handler = jest.fn((): void => {})
        const cancel = value.onUpdate(handler)
        value.set(2)
        expect(handler).toBeCalledWith({ value: 2, oldValue: 1 }, undefined)
        cancel()
        value.set(3)
        expect(handler).toHaveBeenCalledTimes(1)
    })
    it("should not remove a listener again once it has been readded", () => {
        const value = Animatable(1)
        const handler = jest.fn((): void => {})
        const cancel = value.onUpdate(handler)
        cancel()
        value.set(2)
        value.onUpdate(handler)
        value.set(3)
        expect(handler).toBeCalledWith({ value: 3, oldValue: 2 }, undefined)
        handler.mockReset()
        // This is the old cancel function so it shouldn't work anymore
        cancel()
        value.set(4)
        expect(handler).toBeCalledWith({ value: 4, oldValue: 3 }, undefined)
    })
    it("should not cancel a handler in the middle of an update call", () => {
        const value = Animatable(1)
        let cancel2: () => void
        const handler1 = jest.fn(
            (): void => {
                cancel2()
            }
        )
        const handler2 = jest.fn((): void => {})
        value.onUpdate(handler1)
        cancel2 = value.onUpdate(handler2)
        value.set(2)
        expect(handler1).toBeCalledWith({ value: 2, oldValue: 1 }, undefined)
        expect(handler2).toBeCalledWith({ value: 2, oldValue: 1 }, undefined)
    })
    it("should work with transactions", () => {
        const value1 = Animatable(1)
        const handler = jest.fn((): void => {})
        value1.onUpdate(handler)
        let transactionId = undefined
        Animatable.transaction((update, transaction) => {
            transactionId = transaction
            update(value1, 5)
            update(value1, 3)
            update(value1, 4)
            expect(handler).not.toHaveBeenCalled()
        })
        expect(handler).toHaveBeenCalledTimes(1)
        expect(handler).toHaveBeenCalledWith({ value: 4, oldValue: 1 }, transactionId)
    })

    it("should work with transactions and multiple values", () => {
        const value1 = Animatable(1)
        const value2 = Animatable(2)
        const handler = jest.fn((): void => {})
        value1.onUpdate(handler)
        value2.onUpdate(handler)
        Animatable.transaction(update => {
            update(value1, 2)
            update(value2, 3)
            expect(handler).not.toHaveBeenCalled()
        })
        expect(handler).toHaveBeenCalledTimes(2)
    })
    it("should work with transactions, multiple values updating multiple times", () => {
        const value1 = Animatable(1)
        const value2 = Animatable(2)
        const handler = jest.fn((): void => {})
        value1.onUpdate(handler)
        value2.onUpdate(handler)
        Animatable.transaction(update => {
            update(value1, 2)
            update(value2, 2)
            update(value1, 3)
            update(value2, 4)
            expect(handler).not.toHaveBeenCalled()
        })
        expect(handler).toHaveBeenCalledTimes(2)
    })

    test("should not add the same handler twice", () => {
        const value1 = Animatable(1)
        const handler = jest.fn((): void => {})
        value1.onUpdate(handler)
        value1.onUpdate(handler)
        value1.set(2)
        expect(handler).toHaveBeenCalledTimes(1)
    })
})
