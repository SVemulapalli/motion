import * as React from "react"
import { useState } from "react"
import { motion, useCycle } from "@framer"

const style = {
    width: 100,
    height: 100,
    background: "red",
    borderRadius: 5,
}

export const App = () => {
    const variants = {
        a: { x: 0, opacity: 1, borderRadius: 5, scale: 1, y: 0, rotate: 0 },
        b: { x: -100, rotate: 45 },
        c: { y: -100, scale: 2 },
        d: { x: 100, opacity: 1, borderRadius: 100 },
    }

    const [animate, cycle] = useCycle(["a", ["b", "c"], "c", "d"])
    console.log("attempting: ", animate)
    return (
        <motion.div
            animate={animate}
            variants={variants}
            onTap={cycle}
            style={style}
        />
    )
}
