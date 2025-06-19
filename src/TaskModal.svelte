<script>
    import { createEventDispatcher } from "svelte";

    export let show = false;
    export let note = null;

    const dispatch = createEventDispatcher();

    let errorMessage = "";

    let localNote = {
        name: "",
        description: "",
        severity: "low",
    };

    function handleSave(event) {
        event.stopPropagation();
        if (!localNote.name.trim()) {
            errorMessage = "Name is required.";
            return;
        }
        errorMessage = "";
        dispatch("save", localNote);
    }

    function handleCancel(event) {
        event.stopPropagation();
        dispatch("cancel");
    }

    $: if (note) {
        localNote = { ...note };
        note = null;
    }
</script>

{#if show}
    <div class="modal-backdrop">
        <div
            class="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <h2 id="modal-title">{note ? "Edit Note" : "New Note"}</h2>

            <label>
                Name:
                <input
                    type="text"
                    bind:value={localNote.name}
                    placeholder="Enter note name"
                />
            </label>

            {#if errorMessage}
                <p class="error">{errorMessage}</p>
            {/if}

            <label>
                Description:
                <textarea
                    rows="4"
                    bind:value={localNote.description}
                    placeholder="Enter description"
                ></textarea>
            </label>

            <label>
                Severity:
                <select bind:value={localNote.severity}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>
            </label>

            <div class="modal-actions">
                <button on:click={handleSave}>Save</button>
                <button on:click={handleCancel}>Cancel</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999; /* Ensure modal is above everything */
    }

    .modal {
        background: white;
        padding: 2.4rem; /* ~20% bigger from 2rem */
        border-radius: 8px;
        width: 360px; /* 20% bigger than 300px */
        max-width: 90vw;
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        position: relative;
        z-index: 10000; /* Ensure modal content is on top */
        font-family: system-ui, sans-serif;
    }

    label {
        display: flex;
        flex-direction: column;
        font-weight: 600;
        font-size: 0.9rem;
        color: #333;
    }

    input[type="text"],
    textarea,
    select {
        margin-top: 0.3rem;
        padding: 0.5rem 0.7rem;
        border: 1.5px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
        font-family: inherit;
        transition: border-color 0.2s ease;
        resize: vertical;
        background-color: #fafafa;
    }

    input[type="text"]:focus,
    textarea:focus,
    select:focus {
        outline: none;
        border-color: #3b82f6; /* nice blue accent */
        background-color: white;
        box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
    }

    button {
        padding: 0.5rem 1.2rem;
        background-color: #3b82f6;
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s ease;
        font-size: 1rem;
    }

    button:hover {
        background-color: #2563eb;
    }

    button:last-child {
        background-color: #e5e7eb;
        color: #374151;
    }

    button:last-child:hover {
        background-color: #d1d5db;
    }

    .error {
        color: #dc2626; /* red */
        font-size: 0.9rem;
        margin-top: -0.5rem;
        margin-bottom: 0.5rem;
    }
</style>
