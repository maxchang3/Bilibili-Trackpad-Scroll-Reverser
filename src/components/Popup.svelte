<script lang="ts">
    import { onMount } from "svelte"
    
    let dialog: HTMLDialogElement
    
    export const showModal = () => {
        dialog.showModal()
        // 防止背景滚动
        document.body.style.overflow = 'hidden'
    }
    
    export const closeModal = () => {
        dialog.close()
        // 恢复背景滚动
        document.body.style.overflow = ''
    }
    
    onMount(() => {
        showModal()
        
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault()
                closeModal()
            }
        }
        
        dialog.addEventListener('keydown', handleEscape)
        
        const handleBackdropClick = (e: MouseEvent) => {
            if (e.target === dialog) {
                closeModal()
            }
        }
        
        dialog.addEventListener('click', handleBackdropClick)
        
        return () => {
            dialog?.removeEventListener('keydown', handleEscape)
            dialog?.removeEventListener('click', handleBackdropClick)
        }
    })
</script>

<div>
    <dialog bind:this={dialog}>
        <div class="inner"><slot /></div>
    </dialog>
</div>

<style>
    dialog {
        padding: 0;
        border: none;
        border-radius: 16px;
        height: auto;
        max-height: 90vh;
        width: 90%;
        max-width: 600px;
        overflow: auto;
        position: fixed;
        user-select: none;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    
    dialog:not([open]) {
        display: none;
    }
    
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.6);
    }
    
    .inner {
        width: 100%;
        height: auto;
        background: white;
        border-radius: 16px;
    }
    
    .inner:focus {
        outline: none;
    }
    
    @media (max-width: 768px) {
        dialog {
            width: 95%;
            height: auto;
            max-height: 95vh;
            border-radius: 12px;
        }
        
        .inner {
            border-radius: 12px;
        }
    }
</style>
