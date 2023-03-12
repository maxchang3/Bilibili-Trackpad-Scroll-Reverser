import { GM_registerMenuCommand } from "$"
import { deleteMouseMinDelta } from "./utils/data"


export const registerMenus = () => {
    GM_registerMenuCommand("重置设置", () => {
        deleteMouseMinDelta()
        location.reload()
    })
}
