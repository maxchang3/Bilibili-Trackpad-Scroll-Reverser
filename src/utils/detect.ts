import { getMouseMinDelta } from "@/utils/data"

const MOUSE_MIN = getMouseMinDelta() || -1

console.log(`[BILIBILI-TRACKPAD-SCROLL-REVERSER] MOUSE_MIN: ${MOUSE_MIN}`)

export const isFullScreen = () => !!(document.fullscreenElement)

export const isTrackpad = (wheelEvent: WheelEvent) => {
    if (MOUSE_MIN === -1) return Math.abs(wheelEvent.deltaY) < 100
    return (Math.abs(wheelEvent.deltaY) != MOUSE_MIN && Number.isInteger(wheelEvent.deltaY * 2))
}
