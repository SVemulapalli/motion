import * as React from "react"
import { useState } from "react"
import { motion, Appear, useCycle } from "@framer"

const style = {
    width: 100,
    height: 100,
    background: "red",
}

export const App = () => {
    const [isVisible, cycle] = useCycle([true, false])
    return (
        <>
            <Appear enter={{ opacity: 1 }} leave={{ opacity: 0 }}>
                {isVisible && <motion.div key="test" style={style} />}
            </Appear>
            <button onClick={cycle}>Toggle</button>
        </>
    )
}
