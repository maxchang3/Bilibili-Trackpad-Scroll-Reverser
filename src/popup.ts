import { $$ } from "./utils/element"
import { getMouseMinDelta, setMouseMinDelta } from "./utils/data"
interface DOMEvent<T extends EventTarget> extends Event {
    readonly target: T
}

class Popup extends HTMLElement {
    dialog: HTMLDialogElement
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        const style = $$('style').setTextContent(/* css */`
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
        }`)
        const dialog = $$('dialog')
            .setInnerHTML(/* html */`<div class="inner" tabindex="0"><slot></div>`).element
        this.dialog = dialog
        shadow.appendChild(dialog)
        shadow.appendChild(style.element)
    }
    showModal() {
        this.dialog.showModal()
    }
    closeModal() {
        this.dialog.close()
    }
    closeWhenClickOuter() {
        this.dialog.addEventListener('click', ((e: DOMEvent<HTMLDialogElement>) => {
            if (!e || !e.target) return
            if (!e.target.closest('div')) e.target.close()
        }) as EventListener)
    }
}

const setMinDelta = (popup: Popup, delta: number) => {
    setMouseMinDelta(delta)
    alert(`已经设置为【${getMouseMinDelta()}】`)
    popup.closeModal()
    location.reload()
}

export const setupInitPopup = () => {
    if (getMouseMinDelta() !== undefined) return
    customElements.define('my-popup', Popup)
    const popup = $$<Popup>('my-popup')
    const easy = $$('button')
        .setInnerText("简单")
        .setAttribute('class', 'default-btn')
        .on('click', () => {
            setMinDelta(popup.element, 100)
        })
    const easyBox = $$('h3')
        .setInnerText('（直接使用，默认 deltaY 100 以下为触控板）')
        .insert(easy, 'afterbegin')
    const calibrate = $$('button')
        .setInnerText("校准")
        .setAttribute('class', 'default-btn')
        .on('click', () => {
            let MOUSE_MIN = Infinity
            const minDelta = $$('u')
            const minDeltaInfo = $$('h1')
                .setInnerText('最小 |deltaY| ')
                .insert(minDelta)
            const reset = $$('button')
                .setInnerText("重置")
                .on('click', () => {
                    MOUSE_MIN = Infinity
                })
            const submit = $$('button')
                .setInnerText("确定")
                .on('click', () => {
                    setMinDelta(popup.element, MOUSE_MIN)
                })
            popup
                .insert(/*html*/`<h1>请使用<u>最小</u>刻度滚动<u>鼠标滚轮</u>！（优先整数）</h1>`)
                .insert(minDeltaInfo)
                .on('wheel', (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const evt = e as WheelEvent
                    if (evt.deltaY !== 0 && Math.abs(evt.deltaY) < MOUSE_MIN) MOUSE_MIN = Math.abs(evt.deltaY)
                    minDelta.setInnerText(`${MOUSE_MIN} 【当前：${evt.deltaY}】`)
                })
                .insert(reset)
                .insert(submit)
        })
    const calibrateBox = $$('h3')
        .setInnerText('（根据提示移动鼠标和触控板）')
        .insert(calibrate, 'afterbegin')
    popup
        .insert(/*html*/`
            <h1>Bilibili Trackpad Scroll Reverser</h1>
            <h2>初始化，请选择你的反转策略：</h2>
        `)
        .insert(easyBox)
        .insert('&nbsp;')
        .insert(calibrateBox)
    document.body.insertAdjacentElement('afterbegin', popup.element)
    popup.element.showModal()
    window.onload = () => {
        window.player.pause()
        document.body.style.overflow = 'hidden'
    }
}
