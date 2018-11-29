import { useState } from "react"
import { Frame, useMotionValue, createAnimation } from "@framer"

export const App = () => {
    const [pose, setPose] = useState("default")

    return (
        <Frame constraints={{ width: 500, height: 500 }} style={{ backgroundColor: "white" }}>
            <Frame
                constraints={{ width: 100, height: 200, right: 50 }}
                poses={{ default: { width: 100 }, large: { width: 500 } }}
                pose={pose}
                style={{ backgroundColor: "black" }}
                onClick={() => setPose(pose === "default" ? "large" : "default")}
            >
                <Frame constraints={{ height: 100, left: 10, right: 10 }} style={{ backgroundColor: "red" }} />
            </Frame>
        </Frame>
    )
}
