import { FramerEventSession, EventDispatcher } from "../FramerEventSession"
import { FramerEvent } from "../FramerEvent"

describe("Framer Event Session", () => {
    let dispatcher: EventDispatcher
    let gestureBegan: () => void
    let session: FramerEventSession

    beforeEach(() => {
        dispatcher = jest.fn()
        session = new FramerEventSession(dispatcher, {} as any)
    })

    it("should recognize a tap event", () => {
        session.pointerDown(createFramerEvent(session, {}))
        session.pointerUp(createFramerEvent(session, {}))

        expect(dispatcher).toHaveBeenCalledWith("tapend", jasmine.anything(), jasmine.anything())
    })

    it("should recognize a pan", () => {
        session.pointerDown(createFramerEvent(session, {}))
        session.pointerMove(createFramerEvent(session, { pageX: 10, pageY: 10 }))
        expect(dispatcher).toHaveBeenCalledWith("panstart", jasmine.anything(), jasmine.anything())

        session.pointerMove(createFramerEvent(session, { pageX: 12, pageY: 10 }))
        expect(dispatcher).toHaveBeenCalledWith("pan", jasmine.anything(), jasmine.anything())

        session.pointerUp(createFramerEvent(session, {}))
        expect(dispatcher).toHaveBeenCalledWith("panend", jasmine.anything(), jasmine.anything())
    })

    it("should recognize mousewheel events", done => {
        session.mouseWheel(createFramerEvent(session, {}))
        expect(dispatcher).toHaveBeenCalledWith("mousewheelstart", jasmine.anything(), jasmine.anything())

        session.mouseWheel(createFramerEvent(session, { deltaX: 10, deltaY: 10 }))
        expect(dispatcher).toHaveBeenCalledWith("mousewheel", jasmine.anything(), jasmine.anything())

        session.mouseWheel(createFramerEvent(session, { deltaX: 12, deltaY: 12 }))
        expect(dispatcher).toHaveBeenCalledWith("mousewheel", jasmine.anything(), jasmine.anything())

        setTimeout(() => {
            expect(dispatcher).toHaveBeenCalledWith("mousewheelend", jasmine.anything(), jasmine.anything())
            done()
        }, 310)
    })
})

// Helpers

function createFramerEvent(session: FramerEventSession, options: Partial<FramerEventOptions>) {
    return new FramerEvent({ ...framerEventDefaults, ...options } as any, session)
}

interface FramerEventOptions {
    target: any
    deltaX: number
    deltaY: number
    pageX: number
    pageY: number
    button: number
    buttons: number
    ctrlKey: boolean
}

const framerEventDefaults: FramerEventOptions = {
    target: {},
    deltaX: 0,
    deltaY: 0,
    pageX: 0,
    pageY: 0,
    button: 0,
    buttons: 0,
    ctrlKey: false,
}
