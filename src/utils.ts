export const isKeyIn = <T extends object>(key: PropertyKey, obj: T): key is keyof T => key in obj

export const isFullScreen = () => !!(document.fullscreenElement)

export const isTrackpad = (wheelEvent: WheelEvent) => wheelEvent.deltaY && Math.abs(wheelEvent.deltaY) < 100
