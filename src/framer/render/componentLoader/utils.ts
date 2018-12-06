export interface ObjectMap<T> {
    [key: string]: T
}

export type LazyMap<T> = ObjectMap<() => T>

export function cleanFileName(file: string) {
    if (file.startsWith("./")) return file.slice(2)
    return file
}

export function warn(message: string, error?: any) {
    if (process.env.NODE_ENV === "test") return
    // tslint:disable-next-line:no-console
    console.log(
        "%c Loader: %c " + message,
        "color: white; font-weight: bold; background-color: #EE4444; border-radius: 5px; padding: 2px 5px",
        "color: #EE4444"
    )
    if (!error) return
    // tslint:disable-next-line:no-console
    console.log(error)
}
