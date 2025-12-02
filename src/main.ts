import { setupHook } from "@/hook"
import { registerMenus } from "@/menu"
import { getMouseMinDelta } from "@/utils/data"
import App from '@/components/Init.svelte'
import { mount } from "svelte"

setupHook()
registerMenus()
if (getMouseMinDelta() === undefined) {
    window.onload = () => {
        document.body.style.overflow = 'hidden'
        mount(App, {
            target: (() => {
                const app = document.createElement('div')
                document.body.append(app)
                return app
            })(),
        })
    }
}

