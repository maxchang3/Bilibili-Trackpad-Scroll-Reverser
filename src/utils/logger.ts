import { GM_info } from '$'

type LogLevel = 'log' | 'error'

const { name: scriptname, version: scriptversion } = GM_info.script

const log = (logMethod: LogLevel, tag: string, ...args: unknown[]) => {
    const colors = {
        log: '#2c3e50',
        error: '#ff4500',
    }
    const fontFamily =
        "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;"

    console[logMethod](
        `%c ${scriptname} %c v${scriptversion} %c ${tag} `,
        `padding: 2px 6px; border-radius: 3px 0 0 3px; color: #fff; background: #FF6699; font-weight: bold; ${fontFamily}`,
        `padding: 2px 6px; color: #fff; background: #FF9999; font-weight: bold; ${fontFamily}`,
        `padding: 2px 6px; border-radius: 0 3px 3px 0; color: #fff; background: ${colors[logMethod]}; font-weight: bold; ${fontFamily}`,
        ...args
    )
}

const logger = {
    log: (...args: unknown[]) => log('log', '日志', ...args),
    error: (...args: unknown[]) => log('error', '错误', ...args),
}

export default logger
