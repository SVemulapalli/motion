export interface WithStylable {
    _stylableContainer: boolean
}

const key: keyof WithStylable = "_stylableContainer"

export function withStylableContainer(target: any): target is WithStylable {
    return key in target
}
