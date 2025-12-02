import { getMouseMinDelta } from "@/utils/data"

let MOUSE_MIN = getMouseMinDelta() || -1

let container: HTMLDivElement

console.log(`[BILIBILI-TRACKPAD-SCROLL-REVERSER] MOUSE_MIN: ${MOUSE_MIN}`)

export const updateMouseMinDelta = (val: number | undefined) => {
    MOUSE_MIN = val ?? -1
    console.log(`[BILIBILI-TRACKPAD-SCROLL-REVERSER] Updated MOUSE_MIN: ${MOUSE_MIN}`)
}

export const isFullScreen = () => {
    if (!container) container = player.getElements().container
    return !!(document.fullscreenElement) || container.dataset.screen === 'web'
}

export const isTrackpad = (wheelEvent: WheelEvent) => {
    if (MOUSE_MIN === -1) return Math.abs(wheelEvent.deltaY) < 100
    return (Math.abs(wheelEvent.deltaY) != MOUSE_MIN && Number.isInteger(wheelEvent.deltaY * 2))
}
