<script>
    import { createEventDispatcher } from "svelte";

    export let name;
    export let description = "";
    export let severity = "low";
    export let completed = false;

    const dispatch = createEventDispatcher();

    const severityColors = {
        low: "#cce5ff",
        medium: "#ffd580",
        high: "#ff9999",
        critical: "#d1b3ff",
    };

    function toggleComplete(event) {
        event.stopPropagation();
        const updated = {
            name,
            description,
            severity,
            completed: !completed,
            completedAt: !completed ? Date.now() : null,
        };
        dispatch("complete", updated);
    }

    function handleEdit(event) {
        event.stopPropagation();
        dispatch("edit");
    }

    function handleDelete(event) {
        event.stopPropagation();
        dispatch("delete");
    }
</script>

<div
    class="sticky-note {completed ? 'completed' : ''}"
    style="background-color: {completed
        ? '#c8f7c5'
        : severityColors[severity] || severityColors.low};"
>
    <div class="top-left-buttons">
        <button class="icon edit" on:click={handleEdit} aria-label="Edit note">
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M12 20h9" />
                <path
                    d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
                />
            </svg>
        </button>

        <button
            class="icon delete"
            on:click={handleDelete}
            aria-label="Delete note"
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        </button>
    </div>

    <h2>{name}</h2>
    <p>{description}</p>

    <button on:click={toggleComplete}>
        {completed ? "Undo" : "Complete"}
    </button>
</div>

<style>
    .sticky-note {
        position: relative;
        padding: 1rem;
        width: 250px;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
        font-family: sans-serif;
        transition: background-color 0.3s ease;
        cursor: pointer;
    }

    .sticky-note.completed {
        text-decoration: line-through;
        opacity: 0.7;
    }

    /* Container for the top-left buttons */
    .top-left-buttons {
        position: absolute;
        top: 6px;
        right: 6px;
        display: flex;
        gap: 4px;
        z-index: 10;
    }

    /* Icon buttons styling */
    button.icon {
        background: transparent;
        border: none;
        font-size: 1rem;
        line-height: 1;
        padding: 2px 6px;
        border-radius: 4px;
        cursor: pointer;
        user-select: none;
        color: #555;
        transition:
            background-color 0.2s,
            color 0.2s;
    }

    button.icon.edit:hover {
        color: #1a81e8;
    }

    button.icon.delete:hover {
        color: #d93025;
    }

    h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1.2rem;
    }

    p {
        margin: 0 0 1rem 0;
        font-size: 1rem;
    }

    button:not(.icon) {
        padding: 0.5rem 1rem;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    button:not(.icon):hover {
        background-color: #45a049;
    }
</style>
