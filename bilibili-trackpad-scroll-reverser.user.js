// ==UserScript==
// @name         哔哩哔哩触控板滚动反转
// @namespace    http://zhangmaimai.com/
// @version      2.0.5
// @author       MaxChang3
// @description  优化 b 站视频音量调节在触控板上的体验。使用此脚本后，在 b 站视频全屏界面中，使用触控板向下滚动将减少音量。（未安装时为增大）
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/video/*
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function() {
  "use strict";
  var monkeyWindow = window;
  var GM_setValue = /* @__PURE__ */ (() => monkeyWindow.GM_setValue)();
  var GM_deleteValue = /* @__PURE__ */ (() => monkeyWindow.GM_deleteValue)();
  var GM_registerMenuCommand = /* @__PURE__ */ (() => monkeyWindow.GM_registerMenuCommand)();
  var GM_getValue = /* @__PURE__ */ (() => monkeyWindow.GM_getValue)();
  const getMouseMinDelta = () => GM_getValue("MOUSE_MIN", void 0);
  const setMouseMinDelta = (number) => GM_setValue("MOUSE_MIN", number);
  const deleteMouseMinDelta = () => GM_deleteValue("MOUSE_MIN");
  const MOUSE_MIN = getMouseMinDelta() || 100;
  console.log(`[BILIBILI-TRACKPAD-SCROLL-REVERSER] MOUSE_MIN: ${MOUSE_MIN}`);
  const isFullScreen = () => !!document.fullscreenElement;
  const isTrackpad = (wheelEvent) => {
    return Math.abs(wheelEvent.deltaY) < MOUSE_MIN || Math.abs(wheelEvent.deltaY) > MOUSE_MIN && Number.isInteger(wheelEvent.deltaY * 2);
  };
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
  const setupHook = () => {
    EventTarget.prototype.addEventListener = new Proxy(orgin, { apply: applyHandler });
  };
  const registerMenus = () => {
    GM_registerMenuCommand("重置设置", () => {
      deleteMouseMinDelta();
      location.reload();
    });
  };
  class ChainableDOM {
    constructor(tagName, options) {
      __publicField(this, "element");
      this.element = document.createElement(tagName, options);
    }
    setAttribute(...args) {
      this.element.setAttribute(...args);
      return this;
    }
    setInnerText(text) {
      this.element.innerText = text;
      return this;
    }
    setInnerHTML(html) {
      this.element.innerHTML = html;
      return this;
    }
    setTextContent(text) {
      this.element.textContent = text;
      return this;
    }
    insert(element, position = "beforeend") {
      if (element instanceof HTMLElement)
        this.element.insertAdjacentElement(position, element);
      else if (element instanceof ChainableDOM)
        this.element.insertAdjacentElement(position, element.element);
      else
        this.element.insertAdjacentHTML(position, element);
      return this;
    }
    on(type, listener, options) {
      this.element.addEventListener(type, listener, options);
      return this;
    }
  }
  const $$ = (tagName, options) => new ChainableDOM(tagName, options);
  class Popup extends HTMLElement {
    constructor() {
      super();
      __publicField(this, "dialog");
      const shadow = this.attachShadow({ mode: "open" });
      const style = $$("style").setTextContent(
        /* css */
        `
                dialog {
                    padding: 0;
                    border: 0;
                    height: 80%;
                    width: 80%;
                    overflow: hidden;
                    position:fixed;
                    user-select: none;
                }
                dialog::backdrop {
                    background-color: hsla(0,0%,7%,.65);
                }
                .inner {
                    padding: 25px;
                }
                .inner:focus{
                    outline: none;
                }
                .default-btn {
                    box-sizing: border-box;
                    padding: 0;
                    line-height: 30px;
                    height: 30px;
                    border-radius: 6px;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    background: #C9CCD0;
                    position: relative;
        }`
      );
      const dialog = $$("dialog").setInnerHTML(
        /* html */
        `<div class="inner" tabindex="0"><slot></div>`
      ).element;
      this.dialog = dialog;
      shadow.appendChild(dialog);
      shadow.appendChild(style.element);
    }
    showModal() {
      this.dialog.showModal();
    }
    closeModal() {
      this.dialog.close();
    }
    closeWhenClickOuter() {
      this.dialog.addEventListener("click", (e) => {
        if (!e || !e.target)
          return;
        if (!e.target.closest("div"))
          e.target.close();
      });
    }
  }
  let oldAutoPlayStatus;
  const once = (fn) => {
    let done = false;
    return function(...args) {
      return done ? void 0 : (done = true, fn.apply(this, args));
    };
  };
  const setMinDelta = (popup, delta) => {
    setMouseMinDelta(delta);
    alert(`已经设置为【${getMouseMinDelta()}】`);
    popup.closeModal();
    window.player.setAutoplay(oldAutoPlayStatus);
    location.reload();
  };
  const setupInitPopup = () => {
    if (getMouseMinDelta() !== void 0)
      return;
    customElements.define("my-popup", Popup);
    const popup = $$("my-popup");
    const easy = $$("button").setInnerText("简单").setAttribute("class", "default-btn").on("click", () => {
      setMinDelta(popup.element, 100);
    });
    const easyBox = $$("h3").setInnerText("（直接使用，默认 deltaY 100 以下为触控板）").insert(easy, "afterbegin");
    const calibrate = $$("button").setInnerText("校准").setAttribute("class", "default-btn").on("click", once(() => {
      let MOUSE_MIN2 = Infinity;
      const minDelta = $$("u");
      const minDeltaInfo = $$("h1").setInnerText("最小 |deltaY| ").insert(minDelta);
      const reset = $$("button").setInnerText("重置").on("click", () => {
        MOUSE_MIN2 = Infinity;
      });
      const submit = $$("button").setInnerText("确定").on("click", () => {
        setMinDelta(popup.element, MOUSE_MIN2);
      });
      popup.insert(
        /*html*/
        `<h1>请使用<u>最小</u>刻度滚动<u>鼠标滚轮</u>！（优先整数）</h1>`
      ).insert(minDeltaInfo).on("wheel", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const evt = e;
        if (evt.deltaY !== 0 && Math.abs(evt.deltaY) < MOUSE_MIN2)
          MOUSE_MIN2 = Math.abs(evt.deltaY);
        minDelta.setInnerText(`${MOUSE_MIN2} 【当前：${evt.deltaY}】`);
      }).insert(reset).insert(submit);
    }));
    const calibrateBox = $$("h3").setInnerText("（根据提示移动鼠标和触控板）").insert(calibrate, "afterbegin");
    popup.insert(
      /*html*/
      `
            <h1>Bilibili Trackpad Scroll Reverser</h1>
            <h2>初始化，请选择你的反转策略：</h2>
        `
    ).insert(easyBox).insert("&nbsp;").insert(calibrateBox);
    document.body.insertAdjacentElement("afterbegin", popup.element);
    popup.element.showModal();
    window.onload = () => {
      oldAutoPlayStatus = window.player.getAutoplay();
      window.player.setAutoplay(false);
      document.body.style.overflow = "hidden";
    };
  };
  setupHook();
  setupInitPopup();
  registerMenus();
})();
