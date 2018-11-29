import { useEffect } from "react"
import { Frame, useMotionValue, createAnimation } from "@framer"

export const App = () => {
    const blackWidth = useMotionValue(50)

    const grow = createAnimation(blackWidth, 300, { duration: 1000 })

    return (
        <Frame constraints={{ width: 500, height: 500 }} style={{ backgroundColor: "white" }}>
            <Frame
                constraints={{ width: blackWidth, height: 200, right: 50 }}
                style={{ backgroundColor: "black" }}
                onClick={grow.start}
            >
                <Frame constraints={{ height: 100, left: 10, right: 10 }} style={{ backgroundColor: "red" }} />
            </Frame>
        </Frame>
    )
}
