type PlayerEvent =
    "Player_Navigate" |
    "Player_Committed" |
    "Player_Prepared" |
    "Player_Enter_Loading" |
    "Player_Leave_Loading" |
    "Player_Initialized" |
    "Player_Connected" |
    "Player_Show_EndPanel" |
    "Player_Hide_EndPanel" |
    "Player_Show_Controls" |
    "Player_Hide_Controls" |
    "Player_Dispose" |
    "Player_Disconnect" |
    "Player_Idle_Frame" |
    "Player_LoadStart" |
    "Player_LoadedMetadata" |
    "Player_LoadedData" |
    "Player_Canplay" |
    "Player_Play" |
    "Player_Pause" |
    "Player_Waiting" |
    "Player_Playing" |
    "Player_Seeking" |
    "Player_Seeked" |
    "Player_Stalled" |
    "Player_Progress" |
    "Player_Suspend" |
    "Player_TimeUpdate" |
    "Player_RateChange" |
    "Player_VolumeChange" |
    "Player_DurationChange" |
    "Player_Abort" |
    "Player_Ended" |
    "Player_Error" |
    "Player_Emptied" |
    "Player_LoopChange" |
    "Player_MirrorChange" |
    "Player_AspectRatioChange" |
    "Player_LightOffChange" |
    "Player_BlackGapChange" |
    "Player_AutoplayChange" |
    "Player_HandoffChange" |
    "Player_PreferCodecChange" |
    "Player_Loop_Signal" |
    "Player_Handoff_Signal" |
    "Player_Danmaku_Change" |
    "Player_Hotspot_Change" |
    "Player_SharePanel_Change" |
    "Player_ProgressBar_Change" |
    "Player_Access_Changed" |
    "Player_Quality_Changed" |
    "Player_Quality_Requested" |
    "Player_Quality_Rendered" |
    "Player_Statue_Changed" |
    "Player_Container_Resize" |
    "Media_Element_Resize" |
    "Media_Autoplay_Not_Allowed" |
    "Player_Perch_Click" |
    "Player_Submit_Feedback" |
    "Player_Virtual_Action";

declare global {
    const player: {
        setVolume(volume: number): void
        getVolume(): number,
        play(): void,
        pause(): void,
        isPaused(): boolean,
        setAutoplay(e: boolean): void,
        getAutoplay(): boolean,
        on(type: PlayerEvent, eventListner: EventListener): void,
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

export { }
