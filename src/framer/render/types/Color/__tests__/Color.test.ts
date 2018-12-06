import "jest"
import { Color, ConvertColor } from "../index"
import { ColorMixModelType } from "../types"
import { rgbaFromHusl } from "../converters"

describe("converters", () => {
    it("should convert HUSL to RGBA", () => {
        expect(Color.toRgbString(Color(rgbaFromHusl(0, 0, 100, 0.5)))).toEqual("rgba(255, 255, 255, 0.5)")
    })
})

describe("ConvertColor", () => {
    it("should rotate Hue", () => {
        expect(ConvertColor.hueRotate("hsl(120, 100%, 25%)", 180)).toEqual("hsl(300, 100%, 25%)")
    })
    it("should set alpha", () => {
        expect(ConvertColor.setAlpha("white", 0.5)).toEqual("rgba(255, 255, 255, 0.5)")
    })
    it("should get alpha", () => {
        expect(ConvertColor.getAlpha("rgba(255, 255, 255, 0.5)")).toEqual(0.5)
    })
    it("should multiplyAlpha alpha", () => {
        expect(ConvertColor.multiplyAlpha("rgba(255, 255, 255, 0.5)", 0.5)).toEqual("rgba(255, 255, 255, 0.25)")
    })
    it("should convert to HEX", () => {
        expect(ConvertColor.toHex("rgb(255, 255, 255)")).toEqual("#FFFFFF")
    })
    it("should check validity", () => {
        expect(ConvertColor.isValid("rgba(255, 255, no)")).toEqual(false)
    })
    it("should convert to RGB", () => {
        expect(ConvertColor.toRgb("deepskyblue")).toEqual({ a: 1, b: 255, g: 191, r: 0 })
    })
    it("should convert to RGB String", () => {
        expect(ConvertColor.toRgbString("deepskyblue")).toEqual("rgb(0, 191, 255)")
    })
    it("should convert to HSV", () => {
        expect(ConvertColor.toHSV("deepskyblue")).toEqual({ a: 1, h: 195.05882352941174, s: 1, v: 1 })
        expect(ConvertColor.toHSV("hsl(0, 60%, 9%)")).toEqual({ a: 1, h: 0, s: 0.75, v: 0.144 })
    })
    it("should convert to HSV String", () => {
        expect(ConvertColor.toHsvString("deepskyblue")).toEqual("hsv(195, 100%, 100%)")
    })
    it("should convert HSV to string", () => {
        expect(ConvertColor.hsvToString({ a: 1, h: 195.05882352941174, s: 1, v: 1 })).toEqual("hsv(195, 100%, 100%)")
    })
    it("should convert RGB to string", () => {
        expect(ConvertColor.rgbaToString({ a: 1, b: 255, g: 191, r: 0 })).toEqual("rgb(0, 191, 255)")
    })
    it("should convert to HEX or RGB string", () => {
        expect(ConvertColor.toHexOrRgbaString("rgb(0, 191, 255)")).toEqual("#00bfff")
        expect(ConvertColor.toHexOrRgbaString("rgba(0, 191, 255, 0.5)")).toEqual("rgba(0, 191, 255, 0.5)")
    })
    it("should have working toColorPickerSquare", () => {
        expect(ConvertColor.toColorPickerSquare(195)).toEqual("rgb(0, 191, 255)")
    })
    it("should compare colors", () => {
        expect(ConvertColor.equals(Color("hsl(120, 100%, 25%)"), Color("rgb(0, 191, 255)"))).toEqual(false)
        expect(ConvertColor.equals(Color("hsl(120, 100%, 25%)"), Color("hsl(120, 100%, 25%)"))).toEqual(true)
    })
})

describe("static", () => {
    let colors: { [key: string]: Color }
    beforeEach(() => {
        colors = {
            white: Color(255, 255, 255),
            grey: Color(128, 128, 128),
            black: Color(0, 0, 0),
            framer: Color(0, 153, 255),
            alpha: Color(0, 153, 255, 0.5),
        }
    })

    it("should interpolate colors", () => {
        const interpolateProgress = Color.interpolate(colors.black, colors.white)
        expect(Color.toRgbString(interpolateProgress(0))).toEqual("rgb(0, 0, 0)")
        expect(Color.toRgbString(interpolateProgress(0.25))).toEqual("rgb(64, 64, 64)")
        expect(Color.toRgbString(interpolateProgress(0.5))).toEqual("rgb(128, 128, 128)")
        expect(Color.toRgbString(interpolateProgress(0.75))).toEqual("rgb(191, 191, 191)")
        expect(Color.toRgbString(interpolateProgress(1))).toEqual("rgb(255, 255, 255)")
    })
    it("should return difference between 2 colors", () => {
        expect(Color.difference(colors.white, colors.framer)).toBeCloseTo(451.72)
        expect(Color.difference(colors.white, colors.black)).toEqual(765)
        expect(Color.difference(colors.black, colors.white)).toEqual(765)
        expect(Color.difference(colors.black, colors.grey)).toBeCloseTo(384)
        expect(Color.difference(colors.white, colors.white)).toEqual(0)
    })
    it("should mix 2 color instances", () => {
        const mixed = Color.mix(colors.white, colors.framer)
        expect(Color.toRgbString(mixed)).toEqual("rgb(128, 204, 255)")
    })
    it("should mix 2 color with hsl model", () => {
        const mixed = Color.mix(colors.white, colors.framer, undefined, undefined, ColorMixModelType.HSL)
        expect(Color.toRgbString(mixed)).toEqual("rgb(159, 198, 223)")
    })
    it("should mix 2 color strings", () => {
        const mixed = Color.mix(Color("white"), Color("deepskyblue"))
        expect(Color.toRgbString(mixed)).toEqual("rgb(128, 223, 255)")
    })
    it("should mix 2 color hex strings", () => {
        const mixed = Color.mix(Color("0099FF"), Color("FFFFFF"))
        expect(Color.toRgbString(mixed)).toEqual("rgb(128, 204, 255)")
    })
    it("should create random color", () => {
        const rnd = Color.random()
        expect(Color.isColorObject(rnd)).toBe(true)
    })
    it("should create grey color", () => {
        let c = Color.grey(0.2, 0.5)
        expect(Color.toRgbString(c)).toEqual("rgba(51, 51, 51, 0.5)")
        c = Color.gray(0.2, 0.5)
        expect(Color.toRgbString(c)).toEqual("rgba(51, 51, 51, 0.5)")
    })

    it("should check equal colors", () => {
        expect(Color.equal(colors.white, colors.framer)).toEqual(false)
        expect(Color.equal(colors.white, Color("white"))).toEqual(true)
        expect(Color.equal(Color("rgb(254, 254, 254)"), Color("white"))).toEqual(false)
        expect(Color.equal(Color("rgb(254, 254, 254)"), Color("white"), 2)).toEqual(true)
    })
    it("should return correct value for isColorObject", () => {
        expect(
            Color.isColorObject({
                a: 1,
            })
        ).toEqual(false)
        expect(
            Color.isColorObject({
                r: 0,
                g: 0,
                b: 0,
                h: 0,
                s: 0,
                l: 0,
                a: 0,
                roundA: 0,
                format: "rgb",
            })
        ).toEqual(true)
        expect(Color.isColorObject(colors.white)).toEqual(true)
        expect(Color.isColorObject(Color("white"))).toEqual(true)
    })
})
describe("modifications", () => {
    let colors: { [key: string]: Color }
    beforeEach(() => {
        colors = {
            framer: Color(0, 153, 255),
            alpha: Color(0, 153, 255, 0.5),
        }
    })

    it("should make color lighten", () => {
        let lighten = Color.lighten(colors.framer)
        expect(lighten.l).toBeGreaterThan(colors.framer.l)
    })

    it("should make color darken", () => {
        let darken = Color.darken(colors.framer)
        expect(darken.l).toBeLessThan(colors.framer.l)
    })

    it("should make color desaturated", () => {
        let desaturate = Color.desaturate(colors.framer)
        expect(desaturate.s).toBeLessThan(colors.framer.s)
    })

    it("should make color greyscale", () => {
        let grayscale = Color.grayscale(colors.framer)
        expect(grayscale.s).toEqual(0)
    })

    it("should make color saturated", () => {
        const desaturated = Color.desaturate(colors.framer, 20)
        let saturate = Color.saturate(desaturated)
        expect(saturate.s).toBeGreaterThan(desaturated.s)
    })

    it("should make color brighten", () => {
        let brighten = Color.brighten(colors.framer)
        expect(brighten.r).toBeGreaterThan(colors.framer.r)
        expect(brighten.g).toBeGreaterThan(colors.framer.g)
        expect(brighten.b).toEqual(colors.framer.b)
    })

    it("should make color with alpha", () => {
        let alpha = Color.alpha(colors.framer, 0.5)
        expect(alpha.a).toEqual(0.5)
        expect(alpha.a).toBeLessThan(colors.framer.a)
    })

    it("should make color with multiplied alpha", () => {
        let alpha = Color.multiplyAlpha(colors.alpha, 0.5)
        expect(alpha.a).toEqual(0.25)
        expect(alpha.a).toBeLessThan(colors.alpha.a)
    })

    it("should make color with new hue", () => {
        let color = Color.hueRotate(colors.framer, 30)
        expect(color.h).toBeGreaterThan(colors.framer.h)
        color = Color.hueRotate(colors.framer, 180)
        expect(color.h).toBeLessThan(colors.framer.h)
    })

    it("should make color transparent", () => {
        let alpha = Color.transparent(colors.framer)
        expect(alpha.a).toEqual(0)
        expect(alpha.a).toBeLessThan(colors.framer.a)
    })
})
describe("to* methods", () => {
    let colors: { [key: string]: Color }
    beforeEach(() => {
        colors = {
            white: Color(255, 255, 255),
            black: Color(0, 0, 0),
            framer: Color(0, 153, 255),
            alpha: Color(133, 133, 133, 0.5),
            transparent: Color(133, 133, 133, 0),
        }
    })
    it("should covert to name", () => {
        let white = Color.toName(colors.white)
        expect(white).toEqual("white")
        let black = Color.toName(colors.black)
        expect(black).toEqual("black")
        let framer = Color.toName(colors.framer)
        expect(framer).toEqual(false)
        let alpha = Color.toName(colors.alpha)
        expect(alpha).toEqual(false)
        let transparent = Color.toName(colors.transparent)
        expect(transparent).toEqual("transparent")
    })
    it("should covert to HEX", () => {
        let white = Color.toHex(colors.white)
        expect(white).toEqual("ffffff")
        let black = Color.toHex(colors.black)
        expect(black).toEqual("000000")
        let framer = Color.toHex(colors.framer)
        expect(framer).toEqual("0099ff")
    })

    it("should covert to HEX string", () => {
        let white = Color.toHexString(colors.white)
        expect(white).toEqual("#ffffff")
        let black = Color.toHexString(colors.black)
        expect(black).toEqual("#000000")
        let framer = Color.toHexString(colors.framer)
        expect(framer).toEqual("#0099ff")
        let alpha = Color.toHexString(colors.alpha)
        expect(alpha).toEqual("#858585")
    })

    it("should covert to RGB", () => {
        let white = Color.toRgb(colors.white)
        expect(white.r).toEqual(255)
        expect(white.g).toEqual(255)
        expect(white.b).toEqual(255)
        expect(white.a).toEqual(1)
        let black = Color.toRgb(colors.black)
        expect(black.r).toEqual(0)
        expect(black.g).toEqual(0)
        expect(black.b).toEqual(0)
        expect(black.a).toEqual(1)
        let framer = Color.toRgb(colors.framer)
        expect(framer.r).toEqual(0)
        expect(framer.g).toEqual(153)
        expect(framer.b).toEqual(255)
        expect(framer.a).toEqual(1)
    })

    it("should covert to string using RGB", () => {
        let white = Color.toString(colors.white)
        expect(white).toEqual("rgb(255, 255, 255)")
    })

    it("should covert to HSV", () => {
        let white = Color.toHsv(colors.white)
        expect(white.h).toEqual(0)
        expect(white.s).toEqual(0)
        expect(white.v).toEqual(1)
        expect(white.a).toEqual(1)
        let black = Color.toHsv(colors.black)
        expect(black.h).toEqual(0)
        expect(black.s).toEqual(0)
        expect(black.v).toEqual(0)
        expect(black.a).toEqual(1)
        let framer = Color.toHsv(colors.framer)
        expect(framer.h).toEqual(204)
        expect(framer.s).toEqual(1)
        expect(framer.v).toEqual(1)
        expect(framer.a).toEqual(1)
    })

    it("should covert to HSV string", () => {
        let framer = Color.toHsvString(colors.framer)
        expect(framer).toEqual("hsv(204, 100%, 100%)")
    })

    it("should covert to RGB string", () => {
        let white = Color.toRgbString(colors.white)
        expect(white).toEqual("rgb(255, 255, 255)")
        let black = Color.toRgbString(colors.black)
        expect(black).toEqual("rgb(0, 0, 0)")
        let framer = Color.toRgbString(colors.framer)
        expect(framer).toEqual("rgb(0, 153, 255)")
        let alpha = Color.toRgbString(colors.alpha)
        expect(alpha).toEqual("rgba(133, 133, 133, 0.5)")
    })

    it("should covert to HSLuv", () => {
        let white = Color.toHusl(colors.white)
        expect(white.h).toEqual(0)
        expect(white.s).toEqual(0)
        expect(white.l).toEqual(100)
        let black = Color.toHusl(colors.black)
        expect(black.h).toEqual(0)
        expect(black.s).toEqual(0)
        expect(black.l).toEqual(0)
        let framer = Color.toHusl(colors.framer)
        expect(framer.h).toEqual(249.05129665917667)
        expect(framer.s).toEqual(99.99999999999869)
        expect(framer.l).toEqual(61.654825647017844)
    })

    it("should covert to HSL", () => {
        let white = Color.toHsl(colors.white)
        expect(white.h).toEqual(0)
        expect(white.s).toEqual(0)
        expect(white.l).toEqual(1)
        let black = Color.toHsl(colors.black)
        expect(black.h).toEqual(0)
        expect(black.s).toEqual(0)
        expect(black.l).toEqual(0)
        let framer = Color.toHsl(colors.framer)
        expect(framer.h).toEqual(204)
        expect(framer.s).toEqual(1)
        expect(framer.l).toEqual(0.5)
    })
})
describe("constructor", () => {
    describe("different incoming data", () => {
        it("should create proper white color", () => {
            const dup = Color(255, 255, 255)
            const colors = [
                Color(dup),
                Color(255, 255, 255),
                Color({ r: 255, g: 255, b: 255 }),
                Color({ h: 0, s: 0, l: 1 }),
                Color("rgb(255, 255, 255)"),
                Color("hsl(0, 0, 100%)"),
                Color("hsl(0, 0, 1.0)"),
                Color("white"),
                Color("FFFFFF"),
                Color("FFF"),
            ]

            colors.forEach(color => {
                expect(color.r).toEqual(255)
                expect(color.g).toEqual(255)
                expect(color.b).toEqual(255)
                expect(color.h).toEqual(0)
                expect(color.s).toEqual(0)
                expect(color.l).toEqual(1)
                expect(color.a).toEqual(1)
            })
        })

        it("should fallback to black color if provided color is invalid", () => {
            const invalidColor = Color("invalid-color")
            expect(Color.toRgbString(invalidColor)).toEqual("rgb(0, 0, 0)")
            expect(invalidColor.isValid).toEqual(false)
        })

        it("should create proper black color", () => {
            const colors = [
                Color(0, 0, 0),
                Color({ r: 0, g: 0, b: 0 }),
                Color({ h: 0, s: 0, l: 0 }),
                Color("black"),
                Color("000000"),
                Color("000"),
            ]

            colors.forEach(color => {
                expect(color.r).toEqual(0)
                expect(color.g).toEqual(0)
                expect(color.b).toEqual(0)
                expect(color.h).toEqual(0)
                expect(color.s).toEqual(0)
                expect(color.l).toEqual(0)
                expect(color.a).toEqual(1)
            })
        })

        // how this should work?
        it("should create proper grey color", () => {
            const colors = [
                Color(128, 128, 128),
                Color({ r: 128, g: 128, b: 128 }),
                Color({ h: 0, s: 0, l: 0.5 }),
                Color("grey"),
                Color("hsl(0, 0%, 50%)"),
                Color("hsl(0, 0, 0.5)"),
                Color("hsv(0, 0%, 50%)"),
                Color("hsv(0, 0, 0.5)"),
                Color("808080"),
            ]

            colors.forEach(color => {
                expect(Color.toRgbString(color)).toEqual("rgb(128, 128, 128)")
            })
        })

        it("should create proper framer color", () => {
            const colors = [
                Color(0, 153, 255),
                Color({ r: 0, g: 153, b: 255 }),
                Color({ h: 204, s: 1, l: 0.5 }),
                Color("0099ff"),
                Color("09f"),
            ]

            colors.forEach(color => {
                expect(color.r).toEqual(0)
                expect(color.g).toBeCloseTo(153)
                expect(color.b).toEqual(255)
                expect(color.h).toEqual(204)
                expect(color.s).toEqual(1)
                expect(color.a).toEqual(1)
                expect(parseFloat(color.l.toPrecision(1))).toEqual(0.5)
            })
        })
        it("should create proper color from HSVA", () => {
            expect(Color.toRgbString(Color("hsva(204, 61%, 72%, 0.5)"))).toEqual("rgba(72, 139, 184, 0.5)")
            expect(Color.toRgbString(Color("hsv(204, 61%, 72%)"))).toEqual("rgb(72, 139, 184)")
            expect(Color.toRgbString(Color("hsv(204, 0.61, 0.72)"))).toEqual("rgb(72, 139, 184)")
        })
        it("should create proper color from hex4", () => {
            expect(Color.toRgbString(Color("#FFF8"))).toEqual("rgba(255, 255, 255, 0.53)")
        })
        it("should create proper color from hex8", () => {
            expect(Color.toRgbString(Color("#FFFFFF80"))).toEqual("rgba(255, 255, 255, 0.5)")
        })
        it("should create proper color from hsl", () => {
            expect(Color.toRgbString(Color("hsl(0, 60%, 9%)"))).toEqual("rgb(37, 9, 9)")
        })
    })
})
