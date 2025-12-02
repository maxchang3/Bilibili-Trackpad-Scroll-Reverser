import { getMouseMinDelta } from "@/utils/data"
import logger from "@/utils/logger"

let MOUSE_MIN = getMouseMinDelta() || -1

let container: HTMLDivElement

logger.log(MOUSE_MIN === -1 ? '简单模式' : '校准模式')
logger.log(`阈值: ${MOUSE_MIN}`)

export const updateMouseMinDelta = (val: number | undefined) => {
    MOUSE_MIN = val ?? -1
    logger.log(`更新阈值: ${MOUSE_MIN}`)
}

export const isFullScreen = () => {
    if (!container) container = player.getElements().container
    return !!(document.fullscreenElement) || container.dataset.screen === 'web'
}

export const isTrackpad = (wheelEvent: WheelEvent) => {
    if (MOUSE_MIN === -1) return Math.abs(wheelEvent.deltaY) < 100
    return (Math.abs(wheelEvent.deltaY) != MOUSE_MIN && Number.isInteger(wheelEvent.deltaY * 2))
}
