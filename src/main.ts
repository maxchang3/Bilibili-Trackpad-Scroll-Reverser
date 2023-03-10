import { isFullScreen, isTrackpad } from "./utils"

const player = document.querySelector<HTMLElement>('#playerWrap')

if (player === null) throw new Error('Can not detect player')

const orgin = EventTarget.prototype.addEventListener

EventTarget.prototype.addEventListener = function (...args: Parameters<typeof orgin>) {
  const [type, evt, ...rest] = args
  if (this instanceof HTMLElement || !(evt instanceof Function) || type !== "mousewheel") return Reflect.apply(orgin, this, args)
  const evtWrapper: EventListener = (e) => {
    const wheelEvent = e as WheelEvent
    if (!isFullScreen() || !isTrackpad(wheelEvent)) return Reflect.apply(evt, this, [wheelEvent])
    const proxy = new Proxy(wheelEvent, {
      get: (obj, prop) => (typeof prop === "symbol" || prop !== "wheelDelta")
        ? Reflect.get(obj, prop)
        : obj['deltaY'] * 10 // Considering that `wheelDelta` is deprecated
    })
    return Reflect.apply(evt, this, [proxy])
  }
  return Reflect.apply(orgin, this, [type, evtWrapper, ...rest])
}
