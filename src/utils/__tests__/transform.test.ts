import { transform } from "../transform"

describe("transform", () => {
    test("output is as expected", () => {
        const a = 1
        const transformTemplate = transform`a(${a}) b(${({ x }) => x})`

        expect(transformTemplate({ x: 2 })).toBe("a(1) b(2)")
    })
})
