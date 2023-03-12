import { GM_deleteValue, GM_getValue, GM_setValue } from "$"

export const getMouseMinDelta = () => GM_getValue('MOUSE_MIN', undefined)

export const setMouseMinDelta = (number: number) => GM_setValue('MOUSE_MIN', number)

export const deleteMouseMinDelta = () => GM_deleteValue('MOUSE_MIN')
