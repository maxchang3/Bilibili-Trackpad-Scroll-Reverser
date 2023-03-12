declare global {
    interface Window {
        player: {
            setVolume(volume: number): void
            getVolume(): number,
            play(): void,
            pause(): void,
            isPaused(): boolean,
            setAutoplay(e: boolean): void,
            getAutoplay(): boolean,
            auxiliary: {
                closeTabList: () => void,
                disableUserSwitching: () => void,
                enableUserSwitching: () => void,
                isTabListOpen: () => void,
                isUserSwitchingDisabled: () => void,
                openTabList: () => void,
            },
            danmaku: {
                close: () => void,
                isDisabled: () => void,
                isOpen: () => void,
            },
            endPanel: {
                close: () => void,
                isOpen: () => void,
            },
            hotspot: {
                get: () => void,
                set: () => void,
            },
            interaction: {
                isComplete: () => void,
            },
            jump: {
                restart: () => void,
                timeline: () => void,
            },
            sharePanel: {
                close: () => void,
                isOpen: () => void,
                open: () => void,
            },
            toast: {
                create: () => void,
                getActions: () => void,
                remove: () => void,
                resumeClock: () => void,
                suspendClock: () => void,
                update: () => void,
            },
            tooltip: {
                create: () => void,
                remove: () => void,
                update: () => void,
            },
            track: {
                getAudioId: () => void,
                getAudioList: () => void,
                requestAudioId: () => void,
            }
        }
    }
}

export { }
