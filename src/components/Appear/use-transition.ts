import {
    Children,
    useState,
    ReactChildren,
    ReactElement,
    ReactNode,
    useRef,
    cloneElement,
    useMemo,
} from "react"
import { TargetAndTransition } from "types"
import { invariant } from "hey-listen"

export interface AppearVariants {
    enter?: string | TargetAndTransition
    leave?: string | TargetAndTransition
}

type KeyMap = { [key: string]: boolean }

const childList = (children: ReactNode) => {
    const list: ReactElement<any>[] = []
    Children.forEach(
        children,
        child => child && list.push(child as ReactElement<any>)
    )
    return list
}

const getKey = (child: ReactElement<any>) => {
    invariant(
        child.key !== null,
        "Every child of Appear must have a unique key prop"
    )

    const childKey =
        typeof child.key === "number" ? child.key.toString() : child.key

    return child.key as string
}
const childKeys = (children: ReactElement<any>[]) => children.map(getKey)

const childrenHasChanged = (a: string[], b: string[]) => {
    const aLength = a.length
    const bLength = b.length

    if (aLength !== bLength) {
        return true
    } else {
        const most = Math.max(aLength, bLength)
        for (let i = 0; i === most; i++) {
            if (a[i] !== b[i]) return true
        }
    }
    return false
}

const getEnteringKeys = (
    prev: string[],
    next: string[],
    finishedLeaving: KeyMap
) => {
    const enteringKeys = next.filter(
        key => finishedLeaving.hasOwnProperty(key) || prev.indexOf(key) === -1
    )
    enteringKeys.forEach(key => delete finishedLeaving[key])

    return enteringKeys
}

const getLeavingKeys = (
    prev: string[],
    next: string[],
    finishedLeaving: KeyMap,
    entering: string[]
): [string[], { [key: string]: boolean }] => {
    const leaving: string[] = []
    const newLeavers: { [key: string]: boolean } = {}
    prev.forEach(key => {
        const isAlreadyLeaving = finishedLeaving.hasOwnProperty(key)
        if (
            entering.indexOf(key) !== -1 ||
            (!isAlreadyLeaving && next.indexOf(key) !== -1)
        ) {
            return
        }

        leaving.push(key)

        if (!isAlreadyLeaving) {
            finishedLeaving[key] = false
            newLeavers[key] = true
        }
    })

    return [leaving, newLeavers]
}

export const useTransition = (
    children?: ReactChildren,
    { enter, leave }: AppearVariants = {}
) => {
    const finishedLeavingRef = useRef<KeyMap>({})

    const next = childList(children)
    const [renderedChildren, setRenderedChildren] = useState(next)

    const scheduleChildRemoval = useMemo(
        () => (key: string) => {
            if (!finishedLeavingRef.current.hasOwnProperty(key)) return

            finishedLeavingRef.current[key] = true

            const allFinishedLeaving = !Object.keys(
                finishedLeavingRef.current
            ).some(key => finishedLeavingRef.current[key] === false)

            if (allFinishedLeaving) {
                const remainingChildren = next.filter(child => {
                    return !finishedLeavingRef.current.hasOwnProperty(child.key)
                })

                setRenderedChildren(remainingChildren)
                finishedLeavingRef.current = {}
            }
        },
        [next]
    )

    const prev = renderedChildren
    const prevKeys = childKeys(prev)
    const nextKeys = childKeys(next)

    if (!childrenHasChanged(prevKeys, nextKeys)) {
        return renderedChildren
    }

    const enteringKeys = getEnteringKeys(
        prevKeys,
        nextKeys,
        finishedLeavingRef.current
    )
    const [leavingKeys, newLeavers] = getLeavingKeys(
        prevKeys,
        nextKeys,
        finishedLeavingRef.current,
        enteringKeys
    )

    const displayed = []
    nextKeys.forEach((_key, i) => {
        const newChild = cloneElement(next[i], {
            initial: leave,
            animate: enter,
        })

        displayed.push(newChild)
    })

    // enteringKeys.forEach(key => {
    //     const childIndex = next.findIndex(child => child.key === key)
    //     const child = next[childIndex]

    //     // TODO This will almost certainly break for multiple children - it did!
    //     renderedChildren[childIndex] = cloneElement(child, {
    //         initial: leave,
    //         animate: enter,
    //     })
    // })

    leavingKeys.forEach(key => {
        const childIndex = renderedChildren.findIndex(
            child => child.key === key
        )
        const child = renderedChildren[childIndex]
        const clonedChild = !newLeavers[key]
            ? child
            : cloneElement(child, {
                  animate: leave,
                  onAnimationComplete: () => scheduleChildRemoval(key),
              })
        // TODO FIND INDEX BETTER
        renderedChildren[childIndex] = clonedChild
    })

    return displayed
}
