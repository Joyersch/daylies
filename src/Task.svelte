<script>
    export let name;
    export let description = "";
    export let severity = "low"; // default to least urgent
    export let completed = false;
    export let onToggle = () => {};

    const severityColors = {
        low: "#cce5ff", // blue
        medium: "#ffd580", // orange
        high: "#ff9999", // red
        critical: "#d1b3ff", // purple
    };

    function toggleComplete() {
        onToggle();
        completed = !completed;
    }
</script>

<div
    class="sticky-note {completed ? 'completed' : ''}"
    style="background-color: {completed
        ? '#c8f7c5'
        : severityColors[severity] || severityColors.low};"
>
    <h2>{name}</h2>
    <p>{description}</p>
    <button on:click={toggleComplete}>
        {completed ? "Undo" : "Complete"}
    </button>
</div>

<style>
    .sticky-note {
        padding: 1rem;
        width: 250px;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
        font-family: sans-serif;
        transition: background-color 0.3s ease;
    }

    .sticky-note.completed {
        text-decoration: line-through;
    }

    h2 {
        margin: 0 0 0.5rem 0;
        font-size: 1.2rem;
    }

    p {
        margin: 0 0 1rem 0;
        font-size: 1rem;
    }

    button {
        padding: 0.5rem 1rem;
        background-color: #4caf50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    button:hover {
        background-color: #45a049;
    }
</style>
