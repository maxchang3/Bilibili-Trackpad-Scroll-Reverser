type KeyOrElement = keyof HTMLElementTagNameMap | HTMLElement
type KeyOrCustomElement<K extends KeyOrElement> = K extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[K] : K

// To do: rewrite using proxy
class ChainableDOM<K extends KeyOrElement>{
    element: KeyOrCustomElement<K>
    constructor(tagName: K extends keyof HTMLElementTagNameMap ? K : string, options?: ElementCreationOptions) {
        this.element = document.createElement(tagName, options) as KeyOrCustomElement<K>
    }
    setAttribute(...args: Parameters<typeof this.element.setAttribute>) {
        this.element.setAttribute(...args)
        return this
    }
    setInnerText(text: string) {
        this.element.innerText = text
        return this
    }
    setInnerHTML(html: string) {
        this.element.innerHTML = html
        return this
    }
    setTextContent(text: string) {
        this.element.textContent = text
        return this
    }
    insert(element: ChainableDOM<KeyOrElement> | HTMLElement | string, position: InsertPosition = 'beforeend') {
        if (element instanceof HTMLElement) this.element.insertAdjacentElement(position, element)
        else if (element instanceof ChainableDOM) this.element.insertAdjacentElement(position, element.element)
        else this.element.insertAdjacentHTML(position, element)
        return this
    }
    on(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
        this.element.addEventListener(type, listener, options)
        return this
    }
}

export const $$ = <K extends keyof HTMLElementTagNameMap | HTMLElement>
    (
        tagName: K extends keyof HTMLElementTagNameMap ? K : string,
        options?: ElementCreationOptions
    ) => new ChainableDOM<K>(tagName, options)
