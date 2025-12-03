import { mount } from 'svelte'
import App from '@/components/Config.svelte'
import { setupHook } from '@/hook'
import { registerMenus } from '@/menu'
import { getMouseMinDelta } from '@/utils/data'

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
