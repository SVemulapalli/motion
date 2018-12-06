import "jest"

import { ControlType, PropertyControls, verifyPropertyControls } from "../../types/PropertyControls"

import { componentLoader, updateComponentLoaderWithScript } from "../"

test("should verify and rewrite properties", () => {
    const properties = verifyPropertyControls({ hello: ControlType.Boolean, test: { type: ControlType.Enum } })
    expect(properties["hello"]).toEqual({ type: ControlType.Boolean })
    expect(properties["test"]).toBeFalsy()
})

test("should verify and copy properties", () => {
    const props: PropertyControls<{
        foobar: number
        perSide: boolean
        top: number
        right: number
        bottom: number
        left: number
    }> = {
        foobar: {
            type: ControlType.FusedNumber,
            toggleKey: "perSide",
            toggleTitles: ["oeps", "hello"],
            valueKeys: ["top", "right", "bottom", "left"],
            valueLabels: ["high", "low", "what", "where"],
            min: 0,
        },
    }
    const properties = verifyPropertyControls(props)
    expect(properties["foobar"]).toEqual(props["foobar"])
    expect(properties["foobar"] !== props["foobar"]).toBeTruthy()
})

const script = `
const FramerButton_tsx = () => ({
    __info__: [{ name: "Button", children: false }],
    Button: { propertyControls: { foobar: 0 } },
})
const framer_button_pkg = () => ({
    __framer__: {
        packageJson: { name: "@framer/framer.button" },
        sourceModules: { "./FramerButton.tsx": FramerButton_tsx },
        dependencies: {},
    },
})

const a_tsx = () => ({ __info__: [{ name: "Test", children: true }], Test: { propertyControls: { foobar: 0 } } })
const b_tsx = () => ({ error: new Error("b0rk b0rk") })
exports.__framer__ = {
    packageJson: { name: "foobar" },
    sourceModules: { "./a.tsx": a_tsx, "./b.tsx": b_tsx },
    dependencies: { "@framer/framer.button": framer_button_pkg },
}
`

test("component loader", () => {
    updateComponentLoaderWithScript(script, {})
    expect(componentLoader.packageIdentifiers()).toEqual(["foobar", "@framer/framer.button"])
})
