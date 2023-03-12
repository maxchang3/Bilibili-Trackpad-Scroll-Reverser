import { GM_getValue } from "$"

const MOUSE_MIN = GM_getValue('MOUSE_MIN', 100)
console.log(MOUSE_MIN)

export const isFullScreen = () => !!(document.fullscreenElement)

export const isTrackpad = (wheelEvent: WheelEvent) => {
    return (Math.abs(wheelEvent.deltaY) < MOUSE_MIN) ||
        (Math.abs(wheelEvent.deltaY) > MOUSE_MIN && Number.isInteger(wheelEvent.deltaY))
}
