<script lang="ts">
    import Popup from "./Popup.svelte"
    import { getMouseMinDelta, setMouseMinDelta } from "@/utils/data"
    import { updateMouseMinDelta } from "@/utils/detect"

    let openCalibrate = false
    let minDelta: number = Infinity
    let currentDelta: number, popup: Popup
    let existingConfig = getMouseMinDelta()

    player.on("Player_Canplay", () => player.pause())

    export const show = () => {
        existingConfig = getMouseMinDelta()
        openCalibrate = false
        minDelta = Infinity
        popup.showModal()
    }

    const setMinDelta = (delta: number) => {
        if (delta === Infinity) {
            minDelta = Infinity
            return
        }
        setMouseMinDelta(delta)
        updateMouseMinDelta(delta)
        existingConfig = delta
        openCalibrate = false
    }

    const startCalibrate = () => {
        openCalibrate = true
        minDelta = Infinity
        currentDelta = 0
    }

    const cancelCalibrate = () => {
        openCalibrate = false
        minDelta = Infinity
    }

    const calibrate = (e: WheelEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!openCalibrate) return
        const evt = e as WheelEvent
        if (evt.deltaY !== 0 && Math.abs(evt.deltaY) < minDelta)
            minDelta = Math.abs(evt.deltaY)
        currentDelta = evt.deltaY
    }

    const isValid = (
        num: number | undefined,
        placeholder: string = "未设置"
    ) => {
        if (num !== undefined && num !== Infinity) {
            return num
        }
        return placeholder
    }
</script>

<Popup bind:this={popup}>
    <main>
        <div class="header">
            <h1>BiliScrollReverser</h1>
            <a href="https://github.com/maxchang3/BiliScrollReverser" target="_blank" rel="noopener noreferrer" class="repo-link" title="Github">
                <img src="https://github.com/favicon.ico" alt="GitHub" width="24" height="24">
            </a>
        </div>
        
        <div class="content">            
            <div class="option-group">
                {#if !openCalibrate}
                    <button class="option-btn {existingConfig === -1 ? 'active' : ''}" on:click={() => { setMinDelta(-1); openCalibrate = false; }}>
                        <div class="btn-content">
                            <span class="btn-title">简单模式</span>
                            <span class="btn-desc">默认 deltaY &lt; 100 为触控板</span>
                        </div>
                        {#if existingConfig === -1}
                            <span class="badge">已启用</span>
                        {/if}
                    </button>
                {/if}
                
                <div class="calibrate-wrapper">
                    {#if !openCalibrate}
                        <button class="option-btn {(existingConfig !== undefined && existingConfig !== -1) || openCalibrate ? 'active' : ''}" on:click={startCalibrate}>
                            <div class="btn-content">
                                <span class="btn-title">校验模式</span>
                                <span class="btn-desc">
                                    {#if existingConfig !== undefined && existingConfig !== -1}
                                        当前阈值: {existingConfig} (点击重新校验)
                                    {:else}
                                        根据鼠标滚轮校准检测阈值
                                    {/if}
                                </span>
                            </div>
                            {#if existingConfig !== undefined && existingConfig !== -1}
                                <span class="badge">已启用</span>
                            {/if}
                        </button>
                    {/if}

                    {#if openCalibrate}
                        <div class="calibrate-panel">
                            <div class="instruction">
                                <p>请使用<strong>最小刻度</strong>滚动<strong>鼠标滚轮</strong></p>
                                <p class="small-text">请优先选择大多数情况下出现的最小整数值。例如：若通常得到 120，而偶尔出现 118.79 或 1.48 等数值，请忽略后者。</p>
                            </div>

                            <div class="calibrate-area" on:wheel={calibrate}>
                                <div class="calibrate-icon">
                                    <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 2C8.69 2 6 4.69 6 8v8c0 3.31 2.69 6 6 6s6-2.69 6-6V8c0-3.31-2.69-6-6-6zm0 2c2.21 0 4 1.79 4 4v8c0 2.21-1.79 4-4 4s-4-1.79-4-4V8c0-2.21 1.79-4 4-4zm-1 2v4h2V6h-2z"/></svg>
                                </div>
                                <span>在此区域滚动鼠标滚轮</span>
                            </div>
                            
                            <div class="status">
                                <div class="status-item">
                                    <span class="label">最小 deltaY 绝对值:</span>
                                    <span class="value highlight">{isValid(minDelta)}</span>
                                </div>
                                <div class="status-item">
                                    <span class="label">当前值:</span>
                                    <span class="value">{isValid(currentDelta)}</span>
                                </div>
                            </div>
                            
                            <div class="action-buttons">
                                <button class="btn secondary" on:click|stopPropagation={cancelCalibrate}>取消</button>
                                <button class="btn secondary" on:click|stopPropagation={() => (minDelta = Infinity)}>重置</button>
                                <button class="btn primary" on:click|stopPropagation={() => setMinDelta(minDelta)} disabled={minDelta === Infinity}>确定</button>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
            
            <div class="note">
                <strong>注意：</strong>如果鼠标滚动均为整数值，建议选择简单模式
            </div>
        </div>
    </main>
</Popup>

<style>
    main {
        --primary: #007bff;
        --primary-hover: #0056b3;
        --secondary: #6c757d;
        --secondary-hover: #545b62;
        --text: #2c3e50;
        --text-light: #7f8c8d;
        --bg-light: #f8f9fa;
        --border: #dee2e6;
        --success: #28a745;
        
        padding: 20px;
        height: auto;
        font-family: system-ui, -apple-system, sans-serif;
        color: var(--text);
        line-height: 1.5;
    }
    
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 2px solid #ecf0f1;
    }
    
    h1 { margin: 0; font-size: 1.5rem; font-weight: 600; }
    
    .content { text-align: center; }
        
    .option-group {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 16px;
    }
    
    .option-btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 20px;
        background: white;
        border: 2px solid var(--border);
        border-radius: 12px;
        cursor: pointer;
        text-align: left;
    }
    
    .option-btn:hover {
        background: var(--bg-light);
    }
    
    .option-btn.active {
        border-color: var(--primary);
        background: #f0f7ff;
    }
    
    .badge {
        background: var(--primary);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
        white-space: nowrap;
    }
    
    .btn-content {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .btn-title { font-weight: 600; font-size: 1.1rem; }
    .btn-desc { color: var(--text-light); font-size: 0.9rem; }
    
    .note {
        background: #fff3cd;
        color: #856404;
        padding: 12px;
        border-radius: 8px;
        font-size: 0.9rem;
        border: 1px solid #ffeaa7;
    }
    
    .instruction {
        background: #e3f2fd;
        color: #0c5460;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 16px;
    }
    .instruction p { margin: 0; font-size: 1.1rem; }
    
    .calibrate-wrapper {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .calibrate-panel {
        background: var(--bg-light);
        padding: 16px;
        border-radius: 12px;
        border: 1px solid var(--border);
        animation: slideDown 0.2s ease-out;
    }

    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .small-text {
        font-size: 0.85rem;
        color: var(--text-light);
        margin-top: 8px;
    }

    .calibrate-area {
        background: #e3f2fd;
        border: 2px dashed #90caf9;
        border-radius: 8px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
        cursor: ns-resize;
        transition: all 0.2s;
        color: #1976d2;
        margin-bottom: 16px;
    }

    .calibrate-area:hover {
        background: #bbdefb;
        border-color: #64b5f6;
    }

    .calibrate-icon {
        opacity: 0.8;
    }

    .status {
        background: white;
        padding: 16px;
        border-radius: 8px;
        margin: 16px 0;
        display: flex;
        flex-direction: column;
        gap: 12px;
        border: 1px solid var(--border);
    }
    
    .status-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .label { font-weight: 600; color: #495057; }
    
    .value {
        font-family: monospace;
        background: white;
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid var(--border);
        font-size: 1.1rem;
    }
    
    .highlight {
        background: var(--success);
        color: white;
        border-color: var(--success);
    }
    
    .action-buttons {
        display: flex;
        justify-content: center;
        gap: 12px;
    }
    
    .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        color: white;
        font-size: 1rem;
    }
    
    .btn.primary { background: var(--primary); }
    .btn.primary:hover:not(:disabled) { background: var(--primary-hover); }
    
    .btn.secondary { background: var(--secondary); }
    .btn.secondary:hover { background: var(--secondary-hover); }
    
    .btn:disabled { opacity: 0.6; cursor: not-allowed; background: #dee2e6; color: #6c757d; }

    .repo-link {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.6;
        transition: opacity 0.2s;
    }
    .repo-link:hover {
        opacity: 1;
    }
    .repo-link img {
        border-radius: 50%;
    }
</style>
