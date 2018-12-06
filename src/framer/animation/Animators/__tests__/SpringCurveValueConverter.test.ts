import { SpringCurveValueConverter } from "../SpringCurveValueConverter"

describe("computeDampingRatio", () => {
    it("should return correct value", () => {
        expect(SpringCurveValueConverter.computeDampingRatio(10, 12, 2)).toMatchSnapshot()
        expect(SpringCurveValueConverter.computeDampingRatio(10, 12)).toMatchSnapshot()
    })
})
describe("computeDuration", () => {
    it("should return correct value", () => {
        expect(SpringCurveValueConverter.computeDuration(1, 1, 0, 1)).toMatchSnapshot()
        expect(SpringCurveValueConverter.computeDuration(1, 1)).toMatchSnapshot()
    })
    it("should return null", () => {
        expect(SpringCurveValueConverter.computeDuration(10, 10, 0, 1)).toMatchSnapshot()
        expect(SpringCurveValueConverter.computeDuration(10, 10)).toMatchSnapshot()
    })
})
describe("computeDerivedCurveOptions", () => {
    it("should return correct value", () => {
        expect(SpringCurveValueConverter.computeDerivedCurveOptions(1, 1, 0, 1)).toMatchSnapshot()
        expect(SpringCurveValueConverter.computeDerivedCurveOptions(1, 1)).toMatchSnapshot()
        expect(SpringCurveValueConverter.computeDerivedCurveOptions(0.1, 1)).toMatchSnapshot()
    })
})
