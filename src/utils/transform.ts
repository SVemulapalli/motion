type TransformPropsMap = {
    [key: string]: string | number
}

type GetValue = (v: TransformPropsMap) => string | number
type SelectTransformProp = string | number | GetValue

export const transform = (strings: TemplateStringsArray, ...values: SelectTransformProp[]) => {
    const numStrings = strings.length

    return (transformProps: TransformPropsMap) => {
        let output = ""
        for (let i = 0; i < numStrings; i++) {
            output += strings[i]

            const value = values[i]
            if (typeof value === "function") {
                output += (value as GetValue)(transformProps)
            } else if (value !== undefined) {
                output += value
            }
        }

        return output
    }
}
