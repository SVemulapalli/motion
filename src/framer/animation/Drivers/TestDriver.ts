import { Animator as AnimatorInterface } from "../Animators/Animator"
import { AnimationDriver } from "./AnimationDriver"

export class TestAnimationDriver<
    Animator extends AnimatorInterface<Value, Options>,
    Value,
    Options
> extends AnimationDriver<Animator, Value, Options> {
    running = false
    timestep = 1 / 16
    frame = 0
    play() {
        this.running = true
        while (this.running) {
            this.update(this.frame, this.timestep)
            this.frame++
        }
    }

    cancel() {
        this.running = false
    }

    finish() {
        this.running = false
        this.frame = 0
        super.finish()
    }
}

export class AsyncTestAnimationDriver<
    Animator extends AnimatorInterface<Value, Options>,
    Value,
    Options
> extends TestAnimationDriver<Animator, Value, Options> {
    counter = 0
    play() {
        this.running = true
        this.tick()
    }

    tick = () => {
        if (this.counter < 5) {
            this.update(this.frame, this.timestep)
            this.frame++
            setTimeout(this.tick, 100)
        } else {
            this.finish()
        }
    }
}
