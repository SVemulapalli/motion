import "jest"
import { memoize } from "../memoize"

describe("memoize", () => {
    test("it should work", () => {
        const cache = new Map<string, number>()
        function generate(key: string) {
            return parseInt(key)
        }
        expect(memoize(1000, cache, "1234", generate)).toBe(1234)
        expect(memoize(1000, cache, "1234", generate)).toBe(1234)
        expect(memoize(1000, cache, "1234", generate)).toBe(1234)
        expect(cache.get("1234")).toBe(1234)
        expect(cache.size).toBe(1)
    })

    test("it should be limited", () => {
        const cache = new Map<[string, number], number>()

        for (let i = 0; i < 20000; i++) {
            const key: [string, number] = [String(Math.round(Math.random() * 10000)), i & 0xff]
            memoize(1000, cache, key, (k: any) => {
                return parseInt(key[0])
            })
            expect(cache.size).toBeLessThan(1050)
            if (i > 900) {
                expect(cache.size).toBeGreaterThan(500)
            }
        }
    })
})
