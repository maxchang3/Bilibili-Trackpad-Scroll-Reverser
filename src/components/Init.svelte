<script lang="ts">
    import Popup from "./Popup.svelte"
    import { getMouseMinDelta, setMouseMinDelta } from "@/utils/data"

    let openCalibrate = false
    let minDelta: number = Infinity
    let currentDelta: number, popup: Popup

    player.on("Player_Canplay", () => player.pause())

    const setMinDelta = (delta: number) => {
        if (delta === Infinity) {
            alert("不合法的值，请滚动鼠标获取最小整数 delta!")
            return
        }
        setMouseMinDelta(delta)
        alert(`已经设置为【${getMouseMinDelta()}】(-1 为简单模式)`)
        popup.closeModal()
        location.reload()
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
    <main on:wheel={calibrate}>
        <h1>Bilibili Trackpad Scroll Reverser</h1>
        <h2>初始化，请选择你的反转策略：</h2>
        <button class="btn" on:click={() => setMinDelta(-1)}>简单</button>
        <h3>（直接使用，默认 deltaY 100以下为触控)</h3>
        <button class="btn" on:click={() => (openCalibrate = true)}>校准</button
        >
        <h3>（根据提示移动鼠标和触控板）</h3>
        {#if openCalibrate == true}
            <h1>请使用 <u>最小</u> 刻度滚动 <u>鼠标滚轮</u> ！</h1>
            <h1>
                最小 |deltaY| <u> {isValid(minDelta)}</u>
                【当前<u>{isValid(currentDelta)}</u> 】（请优先选择整数值）
            </h1>
            <div class="calibrate-btn">
                <button on:click={() => (minDelta = Infinity)}>重置</button>
                <button on:click={() => setMinDelta(minDelta)}>确定</button>
            </div>
        {/if}
    </main>
</Popup>

<style>
    main {
        height: 100%;
        padding: 25px;
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
