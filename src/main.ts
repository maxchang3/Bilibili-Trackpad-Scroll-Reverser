import { setupHook } from "@/hook"
import { registerMenus } from "@/menu"
import { getMouseMinDelta } from "@/utils/data"
import App from '@/components/Init.svelte'

setupHook()
registerMenus()
if (getMouseMinDelta() === undefined) {
    window.onload = () => {
        player.setAutoplay(false)
        document.body.style.overflow = 'hidden'
    }
    new App({
        target: (() => {
            const app = document.createElement('div')
            document.body.append(app)
            return app
        })(),
    })
}

