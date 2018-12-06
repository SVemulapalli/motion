import { Interpolation } from "../../interpolation/Interpolation"

/**
 * @beta
 */
export interface Animator<Value, Options = any> {
    /**
     * @beta
     */
    setFrom(from: Value): void
    /**
     * @beta
     */
    setTo(to: Value): void
    /**
     * @beta
     */
    isReady(): boolean
    /**
     * @beta
     */
    next(delta: number): Value
    /**
     * @beta
     */
    isFinished(): boolean
}

/**
 * @public
 */
export interface AnimatorClass<Value, Options = any> {
    /**
     * @beta
     */
    new (options: Partial<Options>, interpolation: Interpolation<Value>): Animator<Value, Options>
}
