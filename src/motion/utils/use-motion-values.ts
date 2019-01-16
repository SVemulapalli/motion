import { useMemo, useEffect, RefObject } from "react"
import { MotionValue } from "../../value"
import styler, { Styler } from "stylefire"
import { invariant } from "hey-listen"

export class MotionValuesMap {
    private styler?: Styler
    private values = new Map<string, MotionValue>()
    private unsubscribers = new Map<string, () => void>()

    has(key: string) {
        return this.values.has(key)
    }

    set(key: string, value: MotionValue) {
        this.values.set(key, value)
        this.bindValueToStyler(key, value)
    }

    get<Value>(key: string): MotionValue<Value> | undefined
    get<Value>(key: string, defaultValue: Value): MotionValue<Value>
    get<Value>(key: string, defaultValue?: Value): MotionValue<Value> | undefined {
        let value = this.values.get(key)
        if (value === undefined) {
            if (defaultValue === undefined) {
                if (this.styler) {
                    defaultValue = this.styler.get(key)
                } else {
                    let defaultNumber: any = 0
                    if (key === "scale" || key === "opacity") {
                        defaultNumber = 1
                    }
                    defaultValue = defaultNumber
                }
            }
            value = new MotionValue(defaultValue)
            this.set(key, value)
        }
        return value
    }

    forEach(callback: (value: MotionValue, key: string) => void) {
        return this.values.forEach(callback)
    }

    bindValueToStyler(key: string, value: MotionValue) {
        if (!this.styler) {
            return
        }
        const update = (v: any) => {
            if (!this.styler) {
                return
            }
            this.styler.set(key, v)
        }
        const unsubscribe = value.addRenderSubscription(update)
        this.unsubscribers.set(key, unsubscribe)
    }

    mount(element: Element) {
        this.styler = styler(element)
        this.values.forEach((value, key) => this.bindValueToStyler(key, value))
    }

    unmount() {
        this.values.forEach((_value, key) => {
            const unsubscribe = this.unsubscribers.get(key)
            unsubscribe && unsubscribe()
        })
        this.styler = undefined
    }
}

export const useMotionValues = (ref: RefObject<Element>) => {
    const motionValues = useMemo(() => new MotionValuesMap(), [])

    useEffect(() => {
        invariant(
            ref.current instanceof Element,
            "No `ref` found. Ensure components created with `motion.custom` forward refs using `React.forwardRef`"
        )

        motionValues.mount(ref.current as Element)

        return () => motionValues.unmount()
    })

    return motionValues
}
