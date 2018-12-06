import "jest"
import { serverURL } from "../serverURL"

window.history.pushState({}, "Test Title", "#http://localhost:4567")

it("serverURL should work", () => {
    expect(serverURL("example.jpg")).toBe("http://localhost:4567/example.jpg")
})

it("serverURL should join paths", () => {
    expect(serverURL("path", "to", "example.jpg")).toBe("http://localhost:4567/path/to/example.jpg")
})

it("serverURL should escape path parts", () => {
    expect(serverURL("p th", "t#", "e%ampl?.jpg")).toBe("http://localhost:4567/p%20th/t%23/e%25ampl%3F.jpg")
})

it("should work with full paths", () => {
    expect(serverURL("path/to/example.jpg")).toBe("http://localhost:4567/path/to/example.jpg")
})

it("serverURL should join paths from arrays", () => {
    // this way of calling is used by "framer/resource.url(...)" but not documented/typed for end users
    expect(serverURL(["path", "to"] as any, ["asset", "example.jpg"] as any)).toBe(
        "http://localhost:4567/path/to/asset/example.jpg"
    )
})
