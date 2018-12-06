import { useState } from "react"
import { Frame, useMotionValue, createAnimation } from "@framer"

export const App = () => {
    const [pose, setPose] = useState(400)
    const height = useMotionValue(500)

    return (
        <Frame width={pose} height={height} style={{ marginTop: "50px", backgroundColor: "white" }}>
            <button
                onClick={() => {
                    console.log(pose)
                    setPose(pose === 400 ? 200 : 400)
                }}
            >
                test
            </button>
            <Frame width={"50%"} height={200} right={50} style={{ backgroundColor: "black" }}>
                <Frame
                    borderWidth={10}
                    borderColor="pink"
                    height={100}
                    top={10}
                    left={10}
                    right={10}
                    style={{ backgroundColor: "red" }}
                />
            </Frame>
        </Frame>
    )
}
