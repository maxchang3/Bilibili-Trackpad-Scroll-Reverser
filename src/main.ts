import { isFullScreen, isKeyIn, isTrackpad } from "./utils"

const player = document.querySelector<HTMLElement>('#playerWrap')

if (player === null) throw new Error('Can not detect player')

const orgin = EventTarget.prototype.addEventListener

EventTarget.prototype.addEventListener = function (...args: Parameters<typeof orgin>) {
  const [type, evt, ...rest] = args
  if (this instanceof HTMLElement || !(evt instanceof Function) || type !== "mousewheel") return orgin.apply(this, args)
  const evtWrapper: EventListener = (e: Event) => {
    const wheelEvent = e as WheelEvent
    if (!isFullScreen() || !isTrackpad(wheelEvent)) return evt.apply(this, [wheelEvent])
    const proxy = new Proxy(wheelEvent, {
      get: (obj, prop) => (typeof prop === "symbol" || prop !== "wheelDelta")
        ? isKeyIn(prop, obj) ? obj[prop] : undefined
        : obj['deltaY'] * 10
    })
    return evt.apply(this, [proxy])
  }
  return orgin.apply(this, [type, evtWrapper, ...rest])
}
