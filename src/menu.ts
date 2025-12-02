import { GM_registerMenuCommand } from "$"
import { mount } from "svelte"
import App from '@/components/Init.svelte'

let app: any = null
let appContainer: HTMLElement | null = null

export const registerMenus = () => {
    GM_registerMenuCommand("配置", () => {
        if (app) {
            app.show()
            return
        }
        
        document.body.style.overflow = 'hidden'
        appContainer = document.createElement('div')

        document.body.append(appContainer)
        app = mount(App, {
            target: appContainer,
        })
    })
}
