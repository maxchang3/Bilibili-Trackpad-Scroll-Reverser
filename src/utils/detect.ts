import { getMouseMinDelta } from "@/utils/data"

const MOUSE_MIN = getMouseMinDelta() ?? -1
const EPS = 1e-9

let containerEl: HTMLDivElement | null = null

console.log(`[BILIBILI-TRACKPAD-SCROLL-REVERSER] MOUSE_MIN: ${MOUSE_MIN}`)

export const isFullScreen = (): boolean => {
    if (!containerEl) containerEl = player.getElements().container
    return !!(document.fullscreenElement) || containerEl.dataset.screen === 'web'
}

/**
 * 判断一个数是否「接近整数」或「接近分数」
 */
const isInteger = (num: number, hasNonIntegerDPR = false) => {
    // 检查是否接近整数
    const isNearInteger = hasNonIntegerDPR
        ? Math.abs(num - Math.round(num)) < EPS
        : Number.isInteger(num)
    
    if (isNearInteger) return true
    
    // 如果是非整数 DPR，检查是否接近简单分数（如 1/3, 2/3, 1/2, 1/4, 3/4 等）
    if (hasNonIntegerDPR) {
        for (let denominator = 2; denominator <= 6; denominator++) {
            const multiple = num * denominator
            if (Math.abs(multiple - Math.round(multiple)) < EPS) {
                return true
            }
        }
    }
    
    return false
}

/**
 * 标准化 deltaY 值以处理非整数 DPR
 */
const normalizeDeltaY = (deltaY: number) => {
    const dpr = window.devicePixelRatio
    return Number.isInteger(dpr)
        ? deltaY
        : deltaY * dpr / Math.round(dpr)
}

/**
 * 判断是否为触控板滚动
 */
export const isTrackpad = (wheelEvent: WheelEvent): boolean => {
    // 未记录鼠标最小 delta 时使用启发式判断
    if (MOUSE_MIN === -1) return Math.abs(wheelEvent.deltaY) < 100

    const normalizedDeltaY = normalizeDeltaY(wheelEvent.deltaY)
    const hasNonIntegerDPR = !Number.isInteger(window.devicePixelRatio)

    // 触控板判断条件：
    // 1. 滚动步长不等于固定鼠标步长
    // 2. normalizedDeltaY 接近整数或简单分数
    return Math.abs(normalizedDeltaY) !== MOUSE_MIN && isInteger(normalizedDeltaY, hasNonIntegerDPR)
}
