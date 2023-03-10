import { isFullScreen, isTrackpad } from "./utils"

const player = document.querySelector<HTMLElement>('#playerWrap')

if (player === null) throw new Error('Can not detect player')

const orgin = EventTarget.prototype.addEventListener

type AddEventListener = typeof orgin

interface EventListener<T extends Event> {
  (evt: T): void
}

const applyHandler = <T extends AddEventListener>(target: T, thisArg: EventTarget, args: Parameters<T>) => {
  const [type, evt, ...rest] = args
  if (thisArg instanceof HTMLElement || !(evt instanceof Function) || type !== "mousewheel") return Reflect.apply(target, thisArg, args)
  const evtWrapper: EventListener<WheelEvent> = (e) => {
    if (!isFullScreen() || !isTrackpad(e)) return Reflect.apply(evt, thisArg, [e])
    const proxy = new Proxy(e, {
      get: (obj, prop) => (typeof prop === "symbol" || prop !== "wheelDelta")
        ? Reflect.get(obj, prop)
        : obj['deltaY'] * 10 // Considering that `wheelDelta` is deprecated
    })
    return Reflect.apply(evt, thisArg, [proxy])
  }
  return Reflect.apply(target, thisArg, [type, evtWrapper, ...rest])
}

EventTarget.prototype.addEventListener = new Proxy(orgin, { apply: applyHandler })
