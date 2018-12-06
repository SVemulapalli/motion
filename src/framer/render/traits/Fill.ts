import { Animatable } from "../../animation/Animatable"
import { Background } from "./Background"

export interface FillProperties {
    fill: Animatable<Background> | Background | null
}
