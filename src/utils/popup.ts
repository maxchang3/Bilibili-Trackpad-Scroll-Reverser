import { $$ } from "./element"

interface DOMEvent<T extends EventTarget> extends Event {
    readonly target: T
}

export class Popup extends HTMLElement {
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
