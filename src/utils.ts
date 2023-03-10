export const isFullScreen = () => !!(document.fullscreenElement)

export const isTrackpad = (wheelEvent: WheelEvent) => wheelEvent.deltaY && Math.abs(wheelEvent.deltaY) < 100
