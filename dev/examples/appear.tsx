import * as React from "react"
import { useState } from "react"
import { motion, Appear } from "@framer"

const style = {
    width: 100,
    height: 100,
    background: "red",
}

export const App = () => {
    const [isVisible, setIsVisible] = useState(true)

    return (
        <Appear>
            {isVisible && (
                <motion.div
                    key="test"
                    style={style}
                    onClick={() => setIsVisible(false)}
                />
            )}
        </Appear>
    )
}
