<script lang="ts">
    import { onMount } from "svelte"
    let dialog: HTMLDialogElement
    export const showModal = () => {
        dialog.showModal()
    }
    export const closeModal = () => {
        dialog.close()
    }
    onMount(() => dialog.showModal())
</script>

<div>
    <dialog bind:this={dialog}>
        <div class="inner"><slot /></div>
    </dialog>
</div>

<style>
    dialog {
        padding: 0;
        border: 0;
        height: 80%;
        width: 80%;
        overflow: hidden;
        position: fixed;
        user-select: none;
    }
    dialog::backdrop {
        background-color: hsla(0, 0%, 7%, 0.65);
    }
    .inner {
        padding: 25px;
    }
    .inner:focus {
        outline: none;
    }
</style>
