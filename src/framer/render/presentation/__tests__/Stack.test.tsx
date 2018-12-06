import * as React from "react"
import { mount, ReactWrapper } from "enzyme"
import { Stack, StackProperties } from "../../../components/Stack"
import { Size } from "../../types/Size"

const childSizesEqual: Size[] = [{ width: 100, height: 200 }, { width: 100, height: 200 }, { width: 100, height: 200 }]
const childSizesUnequal: Size[] = [
    { width: 100, height: 200 },
    { width: 200, height: 100 },
    { width: 400, height: 100 },
]

const defaultStackProps: Partial<StackProperties> = {
    direction: "vertical",
    distribution: "start",
    alignment: "start",
    gap: 0,
    padding: 0,
    paddingPerSide: false,
    paddingTop: 0,
    paddingRight: 0,
    paddingLeft: 0,
    paddingBottom: 0,
}

const distibuteStart: any = defaultStackProps
const distibuteCenter: any = { ...defaultStackProps, distribution: "center", gap: 15 }
const distibuteEnd: any = { ...defaultStackProps, distribution: "end", gap: 20 }
const distibuteSpaceBetween: any = { ...defaultStackProps, distribution: "space-between" }
const distibuteSpaceAround: any = { ...defaultStackProps, distribution: "space-around" }
const distibuteSpaceEvenly: any = { ...defaultStackProps, distribution: "space-evenly" }

const stackSize = { width: 1000, height: 800 }

test("should layout children distribution start", () => {
    // equal sized children
    const childRects = Stack.childLayoutRects(childSizesEqual, stackSize, distibuteStart, [])
    expect(childRects).toEqual([
        { x: 0, y: 0, width: 100, height: 200 },
        { x: 0, y: 200, width: 100, height: 200 },
        { x: 0, y: 400, width: 100, height: 200 },
    ])

    // unequal sized children
    const unequalChildRects = Stack.childLayoutRects(childSizesUnequal, stackSize, distibuteStart, [])
    expect(unequalChildRects).toEqual([
        { x: 0, y: 0, width: 100, height: 200 },
        { x: 0, y: 200, width: 200, height: 100 },
        { x: 0, y: 300, width: 400, height: 100 },
    ])
})

test("should layout children distribution center", () => {
    // equal sized children
    const childRects = Stack.childLayoutRects(childSizesEqual, stackSize, distibuteCenter, [])
    expect(childRects).toEqual([
        { x: 0, y: 85, width: 100, height: 200 },
        { x: 0, y: 300, width: 100, height: 200 },
        { x: 0, y: 515, width: 100, height: 200 },
    ])

    // unequal sized children
    const unequalChildRects = Stack.childLayoutRects(childSizesUnequal, stackSize, distibuteCenter, [])
    expect(unequalChildRects).toEqual([
        { x: 0, y: 185, width: 100, height: 200 },
        { x: 0, y: 400, width: 200, height: 100 },
        { x: 0, y: 515, width: 400, height: 100 },
    ])
})

test("should layout children distribution end", () => {
    // equal sized children
    const childRects = Stack.childLayoutRects(childSizesEqual, stackSize, distibuteEnd, [])
    expect(childRects).toEqual([
        { x: 0, y: 160, width: 100, height: 200 },
        { x: 0, y: 380, width: 100, height: 200 },
        { x: 0, y: 600, width: 100, height: 200 },
    ])

    // unequal sized children
    const unequalChildRects = Stack.childLayoutRects(childSizesUnequal, stackSize, distibuteEnd, [])
    expect(unequalChildRects).toEqual([
        { x: 0, y: 360, width: 100, height: 200 },
        { x: 0, y: 580, width: 200, height: 100 },
        { x: 0, y: 700, width: 400, height: 100 },
    ])
})

test("should layout children distribution space between", () => {
    // equal sized children
    const childRects = Stack.childLayoutRects(childSizesEqual, stackSize, distibuteSpaceBetween, [])
    expect(childRects).toEqual([
        { x: 0, y: 0, width: 100, height: 200 },
        { x: 0, y: 300, width: 100, height: 200 },
        { x: 0, y: 600, width: 100, height: 200 },
    ])

    // unequal sized children
    const unequalChildRects = Stack.childLayoutRects(childSizesUnequal, stackSize, distibuteSpaceBetween, [])
    expect(unequalChildRects).toEqual([
        { x: 0, y: 0, width: 100, height: 200 },
        { x: 0, y: 400, width: 200, height: 100 },
        { x: 0, y: 700, width: 400, height: 100 },
    ])
})

test("should layout children distribution space around", () => {
    // equal sized children
    const childRects = Stack.childLayoutRects(childSizesEqual, stackSize, distibuteSpaceAround, [])
    expect(childRects).toEqual([
        { x: 0, y: 33, width: 100, height: 200 },
        { x: 0, y: 300, width: 100, height: 200 },
        { x: 0, y: 567, width: 100, height: 200 },
    ])

    // unequal sized children
    const unequalChildRects = Stack.childLayoutRects(childSizesUnequal, stackSize, distibuteSpaceAround, [])
    expect(unequalChildRects).toEqual([
        { x: 0, y: 67, width: 100, height: 200 },
        { x: 0, y: 400, width: 200, height: 100 },
        { x: 0, y: 633, width: 400, height: 100 },
    ])
})

test("should layout children distribution space evenly", () => {
    // equal sized children
    const childRects = Stack.childLayoutRects(childSizesEqual, stackSize, distibuteSpaceEvenly, [])
    expect(childRects).toEqual([
        { x: 0, y: 50, width: 100, height: 200 },
        { x: 0, y: 300, width: 100, height: 200 },
        { x: 0, y: 550, width: 100, height: 200 },
    ])

    // unequal sized children
    const unequalChildRects = Stack.childLayoutRects(childSizesUnequal, stackSize, distibuteSpaceEvenly, [])
    expect(unequalChildRects).toEqual([
        { x: 0, y: 100, width: 100, height: 200 },
        { x: 0, y: 400, width: 200, height: 100 },
        { x: 0, y: 600, width: 400, height: 100 },
    ])
})

test("should center align single child when distribed space around", () => {
    const childSize = { width: 200, height: 200 }
    const childRects = Stack.childLayoutRects([childSize], stackSize, distibuteSpaceAround, [])
    expect(childRects).toEqual([{ height: 200, width: 200, x: 0, y: 300 }])
})

// Padding

test("should add padding on aligned edges", () => {
    const childSize = { width: 200, height: 200 }
    const childRects = Stack.childLayoutRects([childSize], stackSize, distibuteStart, [])
    const childRect = childRects[0]
    expect(childRect.x).toBe(0)
    expect(childRect.y).toBe(0)

    const stackPropsWithPadding: any = { ...defaultStackProps, padding: 20 }
    const childRectsWithPadding = Stack.childLayoutRects([childSize], stackSize, stackPropsWithPadding, [])
    const childRectWithPadding = childRectsWithPadding[0]
    expect(childRectWithPadding.x).toBe(20)
    expect(childRectWithPadding.y).toBe(20)
})

test("should add padding per side on aligned edges", () => {
    const childSize = { width: 200, height: 200 }
    const stackPropsWithPadding: any = { ...defaultStackProps, paddingPerSide: true, paddingTop: 10, paddingLeft: 30 }
    const childRectsWithPadding = Stack.childLayoutRects([childSize], stackSize, stackPropsWithPadding, [])
    const childRectWithPadding = childRectsWithPadding[0]
    expect(childRectWithPadding.x).toBe(30)
    expect(childRectWithPadding.y).toBe(10)
})

// Hidden items

test("should skip hidden items", () => {
    // equal sized children
    const childRects = Stack.childLayoutRects(childSizesEqual, stackSize, distibuteSpaceEvenly, [1])
    expect(childRects).toEqual([
        { x: 0, y: 133, width: 100, height: 200 },
        { x: 0, y: 0, width: 100, height: 200 },
        { x: 0, y: 467, width: 100, height: 200 },
    ])

    // unequal sized children
    const unequalChildRects = Stack.childLayoutRects(childSizesUnequal, stackSize, distibuteSpaceEvenly, [1])
    expect(unequalChildRects).toEqual([
        { x: 0, y: 167, width: 100, height: 200 },
        { x: 0, y: 0, width: 200, height: 100 },
        { x: 0, y: 533, width: 400, height: 100 },
    ])
})

test("should skip multiple hidden items", () => {
    // equal sized children
    const childRects = Stack.childLayoutRects(childSizesEqual, stackSize, distibuteSpaceEvenly, [1, 2])
    expect(childRects).toEqual([
        { x: 0, y: 300, width: 100, height: 200 },
        { x: 0, y: 0, width: 100, height: 200 },
        { x: 0, y: 0, width: 100, height: 200 },
    ])

    // unequal sized children
    const unequalChildRects = Stack.childLayoutRects(childSizesUnequal, stackSize, distibuteSpaceEvenly, [0, 1])
    expect(unequalChildRects).toEqual([
        { x: 0, y: 0, width: 100, height: 200 },
        { x: 0, y: 0, width: 200, height: 100 },
        { x: 0, y: 350, width: 400, height: 100 },
    ])
})
