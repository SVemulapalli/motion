// document.elementsFromPoint polyfill
if (!document["elementsFromPoint"]) {
    document["elementsFromPoint"] = function elementsFromPoint(x: number, y: number) {
        const parents: HTMLElement[] = []
        let currentParent: HTMLElement | null = null
        do {
            if (currentParent !== document.elementFromPoint(x, y)) {
                currentParent = document.elementFromPoint(x, y) as HTMLElement
                parents.push(currentParent)
                currentParent.style.pointerEvents = "none"
            } else {
                currentParent = null
            }
        } while (currentParent !== null)
        parents.forEach(function(parent) {
            return (parent.style.pointerEvents = "all")
        })
        return parents
    }
}

if (!window["WebKitCSSMatrix"]) {
    window["WebKitCSSMatrix"] = require("xcssmatrix")
}
if (global && !global["WebKitCSSMatrix"]) {
    global["WebKitCSSMatrix"] = require("xcssmatrix")
}

require("css.escape")
