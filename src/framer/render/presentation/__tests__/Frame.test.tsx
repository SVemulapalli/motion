import * as React from "react"
import { Frame, RenderTarget, executeInRenderEnvironment } from "../../"
import { mount, ReactWrapper } from "enzyme"

function child(wrapper: ReactWrapper) {
    return wrapper.childAt(0).childAt(0)
}

function childDiv(wrapper: ReactWrapper) {
    return child(wrapper).childAt(0)
}

test("should resize a child frame with RenderTarget.canvas", () => {
    Frame.prototype.render = jest.fn(Frame.prototype.render)
    const wrapper = executeInRenderEnvironment({ target: RenderTarget.canvas }, () => {
        const w = mount(
            <Frame width={50} height={50}>
                <Frame width={10} height={10} right={5} />
            </Frame>
        )
        expect(childDiv(w).prop("style")).toMatchSnapshot()
        expect(Frame.prototype.render).toHaveBeenCalledTimes(2)
        w.setProps({ width: 100 })
        return w
    })
    expect(childDiv(wrapper).prop("style")).toMatchSnapshot()
    const c = child(wrapper).instance() as Frame
    expect(c.element!.style).toMatchSnapshot()
    expect(Frame.prototype.render).toHaveBeenCalledTimes(4)
})

test("should resize a child frame with CanvasMode.live without rerendering", () => {
    Frame.prototype.render = jest.fn(Frame.prototype.render)
    const wrapper = executeInRenderEnvironment({ target: RenderTarget.preview }, () => {
        const w = mount(
            <Frame width={50} height={50} name={"parent"}>
                <Frame width={10} height={10} right={5} name={"child"} />
            </Frame>
        )
        expect(childDiv(w).prop("style")).toMatchSnapshot()
        expect(Frame.prototype.render).toHaveBeenCalledTimes(2)
        w.setProps({ width: 100 })
        return w
    })
    const c = child(wrapper).instance() as Frame
    expect(c.element!.style).toMatchSnapshot()
    expect(Frame.prototype.render).toHaveBeenCalledTimes(3)
})
