import { getMouseMinDelta } from "./data"

const MOUSE_MIN = getMouseMinDelta() || 100

console.log(`[BILIBILI-TRACKPAD-SCROLL-REVERSER] MOUSE_MIN: ${MOUSE_MIN}`)

export const isFullScreen = () => !!(document.fullscreenElement)

export const isTrackpad = (wheelEvent: WheelEvent) => {
    return (Math.abs(wheelEvent.deltaY) < MOUSE_MIN) ||
        (Math.abs(wheelEvent.deltaY) > MOUSE_MIN && Number.isInteger(wheelEvent.deltaY))
}
