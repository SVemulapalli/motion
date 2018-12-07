import { useState } from "react"
import { Frame, useMotionValue, createAnimation } from "@framer"

export const App = () => {
    const width = useMotionValue(300)
    const height = useMotionValue(500)

    return (
        <Frame width={width} height={height} style={{ marginTop: "50px", backgroundColor: "white" }}>
            <button onClick={() => createAnimation(width, width.get() > 300 ? 300 : 600).start()}>test</button>
            <Frame width={"50%"} height={200} left={50} style={{ backgroundColor: "black" }}>
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
