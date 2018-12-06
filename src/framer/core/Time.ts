// const performance = window.performance || {
//   offset: Date.now(),
//   now: () => Date.now() - this.offset
// };

const _raf = (f: FrameRequestCallback) => {
    setTimeout(f, 1 / 60)
}
const __raf = window.requestAnimationFrame || _raf

export const now = () => performance.now()
export const delay = (f: Function, time: Number) => window.setTimeout(f, time)
export const interval = (f: Function, time: Number) => window.setInterval(f, time)
export const raf = (f: Function) => __raf(f as FrameRequestCallback)
