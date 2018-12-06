import "jest"
import * as React from "react"
import { mount } from "enzyme"
import { hasSelfInParentChain } from "../DesignComponentWrapper"

const message = "it works!"

let nesting = 0
class TestComponent extends React.Component {
    render() {
        nesting += 1
        if (nesting > 10) return <div>OOPS</div>
        if (hasSelfInParentChain(this)) return <div>{message}</div>
        return <TestComponent />
    }
}

test("our react based hasSelfInParentChain works", () => {
    nesting = 0
    const m = mount(<TestComponent />)
    expect(m.text()).toBe(message)
})
