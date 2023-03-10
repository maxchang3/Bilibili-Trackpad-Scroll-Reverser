// ==UserScript==
// @name       哔哩哔哩反转触控板
// @namespace  http://zhangmaimai.com/
// @version    2.0.1
// @author     MaxChang3
// @license    MIT
// @icon       https://www.bilibili.com/favicon.ico
// @match      https://www.bilibili.com/bangumi/play/*
// @match      https://www.bilibili.com/video/*
// @run-at     document-start
// ==/UserScript==

(function() {
  "use strict";
  const isFullScreen = () => !!document.fullscreenElement;
  const isTrackpad = (wheelEvent) => wheelEvent.deltaY && Math.abs(wheelEvent.deltaY) < 100;
  const orgin = EventTarget.prototype.addEventListener;
  const applyHandler = (target, thisArg, args) => {
    const [type, evt, ...rest] = args;
    if (thisArg instanceof HTMLElement || !(evt instanceof Function) || type !== "mousewheel" && type !== "wheel")
      return Reflect.apply(target, thisArg, args);
    const evtWrapper = (e) => {
      if (!isFullScreen() || !isTrackpad(e))
        return Reflect.apply(evt, thisArg, [e]);
      const proxy = new Proxy(e, {
        get: (obj, prop) => typeof prop === "symbol" || prop !== "wheelDelta" ? Reflect.get(obj, prop) : Reflect.get(obj, "deltaY") * 10
        // Considering that `wheelDelta` is deprecated
      });
      return Reflect.apply(evt, thisArg, [proxy]);
    };
    return Reflect.apply(target, thisArg, [type, evtWrapper, ...rest]);
  };
  EventTarget.prototype.addEventListener = new Proxy(orgin, { apply: applyHandler });
})();
