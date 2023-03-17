// ==UserScript==
// @name         哔哩哔哩触控板滚动反转
// @namespace    http://zhangmaimai.com/
// @version      2.1.1
// @author       MaxChang3
// @description  优化 b 站视频音量调节在触控板上的体验。使用此脚本后，在 b 站视频全屏界面中，使用触控板向下滚动将减少音量。（未安装时为增大）
// @license      MIT
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(t=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.textContent=t,document.head.append(e)})(" dialog.svelte-1n5bz51{padding:0;border:0;height:80%;width:80%;overflow:hidden;position:fixed;user-select:none}dialog.svelte-1n5bz51::backdrop{background-color:#121212a6}.inner.svelte-1n5bz51{width:100%;height:100%}.inner.svelte-1n5bz51:focus{outline:none}main.svelte-p43d4u{height:100%;padding:25px}.calibrate-btn.svelte-p43d4u{display:flex;flex-direction:row}button.svelte-p43d4u{box-sizing:border-box;display:flex;align-items:center;justify-content:center;cursor:pointer;border-radius:10px;width:4rem;font-size:1.1rem;background:#479fd1;color:#fff;border:0;margin-right:5px;padding:10px}button.svelte-p43d4u:focus{outline:none} ");

(function () {
  'use strict';

  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const getMouseMinDelta = () => _GM_getValue("MOUSE_MIN", void 0);
  const setMouseMinDelta = (number) => _GM_setValue("MOUSE_MIN", number);
  const deleteMouseMinDelta = () => _GM_deleteValue("MOUSE_MIN");
  const MOUSE_MIN = getMouseMinDelta() || -1;
  console.log(`[BILIBILI-TRACKPAD-SCROLL-REVERSER] MOUSE_MIN: ${MOUSE_MIN}`);
  const isFullScreen = () => !!document.fullscreenElement;
  const isTrackpad = (wheelEvent) => {
    if (MOUSE_MIN === -1)
      return Math.abs(wheelEvent.deltaY) < 100;
    return Math.abs(wheelEvent.deltaY) != MOUSE_MIN && Number.isInteger(wheelEvent.deltaY * 2);
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
    _GM_registerMenuCommand("重置设置", () => {
      deleteMouseMinDelta();
      location.reload();
    });
  };
  function noop() {
  }
  function assign(tar, src) {
    for (const k in src)
      tar[k] = src[k];
    return tar;
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return /* @__PURE__ */ Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function is_function(thing) {
    return typeof thing === "function";
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
  }
  function is_empty(obj) {
    return Object.keys(obj).length === 0;
  }
  function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
      const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
      return definition[0](slot_ctx);
    }
  }
  function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
  }
  function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
      const lets = definition[2](fn(dirty));
      if ($$scope.dirty === void 0) {
        return lets;
      }
      if (typeof lets === "object") {
        const merged = [];
        const len = Math.max($$scope.dirty.length, lets.length);
        for (let i = 0; i < len; i += 1) {
          merged[i] = $$scope.dirty[i] | lets[i];
        }
        return merged;
      }
      return $$scope.dirty | lets;
    }
    return $$scope.dirty;
  }
  function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
      const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
      slot.p(slot_context, slot_changes);
    }
  }
  function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
      const dirty = [];
      const length = $$scope.ctx.length / 32;
      for (let i = 0; i < length; i++) {
        dirty[i] = -1;
      }
      return dirty;
    }
    return -1;
  }
  function append(target, node) {
    target.appendChild(node);
  }
  function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
  }
  function detach(node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  }
  function element(name) {
    return document.createElement(name);
  }
  function text(data) {
    return document.createTextNode(data);
  }
  function space() {
    return text(" ");
  }
  function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
  }
  function attr(node, attribute, value) {
    if (value == null)
      node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
      node.setAttribute(attribute, value);
  }
  function children(element2) {
    return Array.from(element2.childNodes);
  }
  function set_data(text2, data) {
    data = "" + data;
    if (text2.wholeText !== data)
      text2.data = data;
  }
  let current_component;
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
  }
  const dirty_components = [];
  const binding_callbacks = [];
  let render_callbacks = [];
  const flush_callbacks = [];
  const resolved_promise = /* @__PURE__ */ Promise.resolve();
  let update_scheduled = false;
  function schedule_update() {
    if (!update_scheduled) {
      update_scheduled = true;
      resolved_promise.then(flush);
    }
  }
  function add_render_callback(fn) {
    render_callbacks.push(fn);
  }
  const seen_callbacks = /* @__PURE__ */ new Set();
  let flushidx = 0;
  function flush() {
    if (flushidx !== 0) {
      return;
    }
    const saved_component = current_component;
    do {
      try {
        while (flushidx < dirty_components.length) {
          const component = dirty_components[flushidx];
          flushidx++;
          set_current_component(component);
          update(component.$$);
        }
      } catch (e) {
        dirty_components.length = 0;
        flushidx = 0;
        throw e;
      }
      set_current_component(null);
      dirty_components.length = 0;
      flushidx = 0;
      while (binding_callbacks.length)
        binding_callbacks.pop()();
      for (let i = 0; i < render_callbacks.length; i += 1) {
        const callback = render_callbacks[i];
        if (!seen_callbacks.has(callback)) {
          seen_callbacks.add(callback);
          callback();
        }
      }
      render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
      flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
  }
  function update($$) {
    if ($$.fragment !== null) {
      $$.update();
      run_all($$.before_update);
      const dirty = $$.dirty;
      $$.dirty = [-1];
      $$.fragment && $$.fragment.p($$.ctx, dirty);
      $$.after_update.forEach(add_render_callback);
    }
  }
  function flush_render_callbacks(fns) {
    const filtered = [];
    const targets = [];
    render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
    targets.forEach((c) => c());
    render_callbacks = filtered;
  }
  const outroing = /* @__PURE__ */ new Set();
  let outros;
  function transition_in(block, local) {
    if (block && block.i) {
      outroing.delete(block);
      block.i(local);
    }
  }
  function transition_out(block, local, detach2, callback) {
    if (block && block.o) {
      if (outroing.has(block))
        return;
      outroing.add(block);
      outros.c.push(() => {
        outroing.delete(block);
        if (callback) {
          if (detach2)
            block.d(1);
          callback();
        }
      });
      block.o(local);
    } else if (callback) {
      callback();
    }
  }
  function create_component(block) {
    block && block.c();
  }
  function mount_component(component, target, anchor, customElement) {
    const { fragment, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
      add_render_callback(() => {
        const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
        if (component.$$.on_destroy) {
          component.$$.on_destroy.push(...new_on_destroy);
        } else {
          run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
      });
    }
    after_update.forEach(add_render_callback);
  }
  function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
      flush_render_callbacks($$.after_update);
      run_all($$.on_destroy);
      $$.fragment && $$.fragment.d(detaching);
      $$.on_destroy = $$.fragment = null;
      $$.ctx = [];
    }
  }
  function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
      dirty_components.push(component);
      schedule_update();
      component.$$.dirty.fill(0);
    }
    component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
  }
  function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
      fragment: null,
      ctx: [],
      // state
      props,
      update: noop,
      not_equal,
      bound: blank_object(),
      // lifecycle
      on_mount: [],
      on_destroy: [],
      on_disconnect: [],
      before_update: [],
      after_update: [],
      context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
      // everything else
      callbacks: blank_object(),
      dirty,
      skip_bound: false,
      root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
      const value = rest.length ? rest[0] : ret;
      if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
        if (!$$.skip_bound && $$.bound[i])
          $$.bound[i](value);
        if (ready)
          make_dirty(component, i);
      }
      return ret;
    }) : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
    if (options.target) {
      if (options.hydrate) {
        const nodes = children(options.target);
        $$.fragment && $$.fragment.l(nodes);
        nodes.forEach(detach);
      } else {
        $$.fragment && $$.fragment.c();
      }
      if (options.intro)
        transition_in(component.$$.fragment);
      mount_component(component, options.target, options.anchor, options.customElement);
      flush();
    }
    set_current_component(parent_component);
  }
  class SvelteComponent {
    $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
    $on(type, callback) {
      if (!is_function(callback)) {
        return noop;
      }
      const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return () => {
        const index = callbacks.indexOf(callback);
        if (index !== -1)
          callbacks.splice(index, 1);
      };
    }
    $set($$props) {
      if (this.$$set && !is_empty($$props)) {
        this.$$.skip_bound = true;
        this.$$set($$props);
        this.$$.skip_bound = false;
      }
    }
  }
  function create_fragment$1(ctx) {
    let div1;
    let dialog_1;
    let div0;
    let current;
    const default_slot_template = (
      /*#slots*/
      ctx[4].default
    );
    const default_slot = create_slot(
      default_slot_template,
      ctx,
      /*$$scope*/
      ctx[3],
      null
    );
    return {
      c() {
        div1 = element("div");
        dialog_1 = element("dialog");
        div0 = element("div");
        if (default_slot)
          default_slot.c();
        attr(div0, "class", "inner svelte-1n5bz51");
        attr(dialog_1, "class", "svelte-1n5bz51");
      },
      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, dialog_1);
        append(dialog_1, div0);
        if (default_slot) {
          default_slot.m(div0, null);
        }
        ctx[5](dialog_1);
        current = true;
      },
      p(ctx2, [dirty]) {
        if (default_slot) {
          if (default_slot.p && (!current || dirty & /*$$scope*/
          8)) {
            update_slot_base(
              default_slot,
              default_slot_template,
              ctx2,
              /*$$scope*/
              ctx2[3],
              !current ? get_all_dirty_from_scope(
                /*$$scope*/
                ctx2[3]
              ) : get_slot_changes(
                default_slot_template,
                /*$$scope*/
                ctx2[3],
                dirty,
                null
              ),
              null
            );
          }
        }
      },
      i(local) {
        if (current)
          return;
        transition_in(default_slot, local);
        current = true;
      },
      o(local) {
        transition_out(default_slot, local);
        current = false;
      },
      d(detaching) {
        if (detaching)
          detach(div1);
        if (default_slot)
          default_slot.d(detaching);
        ctx[5](null);
      }
    };
  }
  function instance$1($$self, $$props, $$invalidate) {
    let { $$slots: slots = {}, $$scope } = $$props;
    let dialog;
    const showModal = () => {
      dialog.showModal();
    };
    const closeModal = () => {
      dialog.close();
    };
    onMount(() => dialog.showModal());
    function dialog_1_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        dialog = $$value;
        $$invalidate(0, dialog);
      });
    }
    $$self.$$set = ($$props2) => {
      if ("$$scope" in $$props2)
        $$invalidate(3, $$scope = $$props2.$$scope);
    };
    return [dialog, showModal, closeModal, $$scope, slots, dialog_1_binding];
  }
  class Popup extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance$1, create_fragment$1, safe_not_equal, { showModal: 1, closeModal: 2 });
    }
    get showModal() {
      return this.$$.ctx[1];
    }
    get closeModal() {
      return this.$$.ctx[2];
    }
  }
  function create_if_block(ctx) {
    let h10;
    let t5;
    let h11;
    let t6;
    let u2;
    let t7_value = (
      /*isValid*/
      ctx[6](
        /*minDelta*/
        ctx[1]
      ) + ""
    );
    let t7;
    let t8;
    let u3;
    let t9_value = (
      /*isValid*/
      ctx[6](
        /*currentDelta*/
        ctx[2]
      ) + ""
    );
    let t9;
    let t10;
    let t11;
    let div;
    let button0;
    let t13;
    let button1;
    let mounted;
    let dispose;
    return {
      c() {
        h10 = element("h1");
        h10.innerHTML = `请使用 <u>最小</u> 刻度滚动 <u>鼠标滚轮</u> ！`;
        t5 = space();
        h11 = element("h1");
        t6 = text("最小 |deltaY| ");
        u2 = element("u");
        t7 = text(t7_value);
        t8 = text("\n                【当前");
        u3 = element("u");
        t9 = text(t9_value);
        t10 = text(" 】（请优先选择整数值）");
        t11 = space();
        div = element("div");
        button0 = element("button");
        button0.textContent = "重置";
        t13 = space();
        button1 = element("button");
        button1.textContent = "确定";
        attr(button0, "class", "svelte-p43d4u");
        attr(button1, "class", "svelte-p43d4u");
        attr(div, "class", "calibrate-btn svelte-p43d4u");
      },
      m(target, anchor) {
        insert(target, h10, anchor);
        insert(target, t5, anchor);
        insert(target, h11, anchor);
        append(h11, t6);
        append(h11, u2);
        append(u2, t7);
        append(h11, t8);
        append(h11, u3);
        append(u3, t9);
        append(h11, t10);
        insert(target, t11, anchor);
        insert(target, div, anchor);
        append(div, button0);
        append(div, t13);
        append(div, button1);
        if (!mounted) {
          dispose = [
            listen(
              button0,
              "click",
              /*click_handler_2*/
              ctx[9]
            ),
            listen(
              button1,
              "click",
              /*click_handler_3*/
              ctx[10]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (dirty & /*minDelta*/
        2 && t7_value !== (t7_value = /*isValid*/
        ctx2[6](
          /*minDelta*/
          ctx2[1]
        ) + ""))
          set_data(t7, t7_value);
        if (dirty & /*currentDelta*/
        4 && t9_value !== (t9_value = /*isValid*/
        ctx2[6](
          /*currentDelta*/
          ctx2[2]
        ) + ""))
          set_data(t9, t9_value);
      },
      d(detaching) {
        if (detaching)
          detach(h10);
        if (detaching)
          detach(t5);
        if (detaching)
          detach(h11);
        if (detaching)
          detach(t11);
        if (detaching)
          detach(div);
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_default_slot(ctx) {
    let main;
    let h1;
    let t1;
    let h2;
    let t3;
    let button0;
    let t5;
    let h30;
    let t7;
    let button1;
    let t9;
    let h31;
    let t11;
    let mounted;
    let dispose;
    let if_block = (
      /*openCalibrate*/
      ctx[0] == true && create_if_block(ctx)
    );
    return {
      c() {
        main = element("main");
        h1 = element("h1");
        h1.textContent = "Bilibili Trackpad Scroll Reverser";
        t1 = space();
        h2 = element("h2");
        h2.textContent = "初始化，请选择你的反转策略：";
        t3 = space();
        button0 = element("button");
        button0.textContent = "简单";
        t5 = space();
        h30 = element("h3");
        h30.textContent = "（直接使用，默认 deltaY 100以下为触控)";
        t7 = space();
        button1 = element("button");
        button1.textContent = "校准";
        t9 = space();
        h31 = element("h3");
        h31.textContent = "（校准使用，根据提示移动鼠标）【注意：对于 Windows 设备如果鼠标任意滚动幅度下均为整数值，请暂时选择简单模式】";
        t11 = space();
        if (if_block)
          if_block.c();
        attr(button0, "class", "btn svelte-p43d4u");
        attr(button1, "class", "btn svelte-p43d4u");
        attr(main, "class", "svelte-p43d4u");
      },
      m(target, anchor) {
        insert(target, main, anchor);
        append(main, h1);
        append(main, t1);
        append(main, h2);
        append(main, t3);
        append(main, button0);
        append(main, t5);
        append(main, h30);
        append(main, t7);
        append(main, button1);
        append(main, t9);
        append(main, h31);
        append(main, t11);
        if (if_block)
          if_block.m(main, null);
        if (!mounted) {
          dispose = [
            listen(
              button0,
              "click",
              /*click_handler*/
              ctx[7]
            ),
            listen(
              button1,
              "click",
              /*click_handler_1*/
              ctx[8]
            ),
            listen(
              main,
              "wheel",
              /*calibrate*/
              ctx[5]
            )
          ];
          mounted = true;
        }
      },
      p(ctx2, dirty) {
        if (
          /*openCalibrate*/
          ctx2[0] == true
        ) {
          if (if_block) {
            if_block.p(ctx2, dirty);
          } else {
            if_block = create_if_block(ctx2);
            if_block.c();
            if_block.m(main, null);
          }
        } else if (if_block) {
          if_block.d(1);
          if_block = null;
        }
      },
      d(detaching) {
        if (detaching)
          detach(main);
        if (if_block)
          if_block.d();
        mounted = false;
        run_all(dispose);
      }
    };
  }
  function create_fragment(ctx) {
    let popup_1;
    let current;
    let popup_1_props = {
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    };
    popup_1 = new Popup({ props: popup_1_props });
    ctx[11](popup_1);
    return {
      c() {
        create_component(popup_1.$$.fragment);
      },
      m(target, anchor) {
        mount_component(popup_1, target, anchor);
        current = true;
      },
      p(ctx2, [dirty]) {
        const popup_1_changes = {};
        if (dirty & /*$$scope, minDelta, currentDelta, openCalibrate*/
        4103) {
          popup_1_changes.$$scope = { dirty, ctx: ctx2 };
        }
        popup_1.$set(popup_1_changes);
      },
      i(local) {
        if (current)
          return;
        transition_in(popup_1.$$.fragment, local);
        current = true;
      },
      o(local) {
        transition_out(popup_1.$$.fragment, local);
        current = false;
      },
      d(detaching) {
        ctx[11](null);
        destroy_component(popup_1, detaching);
      }
    };
  }
  function instance($$self, $$props, $$invalidate) {
    let openCalibrate = false;
    let minDelta = Infinity;
    let currentDelta, popup;
    player.on("Player_Canplay", () => player.pause());
    const setMinDelta = (delta) => {
      if (delta === Infinity) {
        alert("不合法的值，请滚动鼠标获取最小整数 delta!");
        return;
      }
      setMouseMinDelta(delta);
      alert(`已经设置为【${getMouseMinDelta()}】(-1 为简单模式)`);
      popup.closeModal();
      location.reload();
    };
    const calibrate = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!openCalibrate)
        return;
      const evt = e;
      if (evt.deltaY !== 0 && Math.abs(evt.deltaY) < minDelta)
        $$invalidate(1, minDelta = Math.abs(evt.deltaY));
      $$invalidate(2, currentDelta = evt.deltaY);
    };
    const isValid = (num, placeholder = "未设置") => {
      if (num !== void 0 && num !== Infinity) {
        return num;
      }
      return placeholder;
    };
    const click_handler = () => setMinDelta(-1);
    const click_handler_1 = () => $$invalidate(0, openCalibrate = true);
    const click_handler_2 = () => $$invalidate(1, minDelta = Infinity);
    const click_handler_3 = () => setMinDelta(minDelta);
    function popup_1_binding($$value) {
      binding_callbacks[$$value ? "unshift" : "push"](() => {
        popup = $$value;
        $$invalidate(3, popup);
      });
    }
    return [
      openCalibrate,
      minDelta,
      currentDelta,
      popup,
      setMinDelta,
      calibrate,
      isValid,
      click_handler,
      click_handler_1,
      click_handler_2,
      click_handler_3,
      popup_1_binding
    ];
  }
  class Init extends SvelteComponent {
    constructor(options) {
      super();
      init(this, options, instance, create_fragment, safe_not_equal, {});
    }
  }
  setupHook();
  registerMenus();
  if (getMouseMinDelta() === void 0) {
    window.onload = () => {
      document.body.style.overflow = "hidden";
      new Init({
        target: (() => {
          const app = document.createElement("div");
          document.body.append(app);
          return app;
        })()
      });
    };
  }

})();
