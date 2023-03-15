<script lang="ts">
    import Popup from "./Popup.svelte"
    import { getMouseMinDelta, setMouseMinDelta } from "@/utils/data"

    let openCalibrate = false
    let oldAutoPlayStatus: boolean = player.getAutoplay()
    let popup: Popup, main: HTMLElement, minDelta: HTMLElement
    
    const setMinDelta = (delta: number) => {
        setMouseMinDelta(delta)
        alert(`已经设置为【${getMouseMinDelta()}】(-1 为简单模式)`)
        popup.closeModal()
        player.setAutoplay(oldAutoPlayStatus)
        location.reload()
    }

    let MOUSE_MIN = Infinity

    const calibrate = (e: WheelEvent) => {
        e.preventDefault()
        e.stopPropagation()
        const evt = e as WheelEvent
        console.log(e)
        if (evt.deltaY !== 0 && Math.abs(evt.deltaY) < MOUSE_MIN)
            MOUSE_MIN = Math.abs(evt.deltaY)
        minDelta.innerText = `${MOUSE_MIN} 【当前：${evt.deltaY}】`
    }

    const setEasy = () => {
        setMinDelta(-1)
        popup.closeModal()
    }

    const setCalibrate = () => {
        openCalibrate = true
        main.addEventListener("wheel", calibrate)
    }
</script>

<Popup bind:this={popup}>
    <main bind:this={main}>
        <h1>Bilibili Trackpad Scroll Reverser</h1>
        <h2>初始化，请选择你的反转策略：</h2>
        <button class="btn" on:click={setEasy}>简单</button>
        <h3>（直接使用，默认 deltaY 100以下为触控)</h3>
        <button class="btn" on:click={setCalibrate}>校准</button>
        <h3>（根据提示移动鼠标和触控板）</h3>
        {#if openCalibrate == true}
            <h1>请使用<u>最小</u>刻度滚动<u>鼠标滚轮</u>！（优先整数）</h1>
            <h1>最小 |deltaY| <u bind:this={minDelta} /></h1>
            <div class="calibrate-btn">
                <button on:click={() => (MOUSE_MIN = Infinity)}>重置</button>
                <button on:click={() => setMinDelta(MOUSE_MIN)}>确定</button>
            </div>
        {/if}
    </main>
</Popup>

<style>
    main {
        display: flex;
        flex-direction: column;
    }
    .calibrate-btn {
        display: flex;
        flex-direction: row;
    }
    button {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 10px;
        width: 4rem;
        font-size: 1.1rem;
        background: #479fd1;
        color: white;
        border: 0;
        margin-right: 5px;
        padding: 10px;
    }
    button:focus {
        outline: none;
    }
</style>
