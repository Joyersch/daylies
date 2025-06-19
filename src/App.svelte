<script>
	import { onMount } from "svelte";
	import Task from "./Task.svelte";
	let notes = [];

	const severityOrder = {
		critical: 0,
		high: 1,
		medium: 2,
		low: 3,
	};

	$: sortedNotes = [...notes].sort((a, b) => {
		if (a.completed !== b.completed) return a.completed ? 1 : -1;

		return severityOrder[a.severity] - severityOrder[b.severity];
	});

	function toggleNoteCompletion(index) {
		notes = notes.map((note, i) => {
			if (i === index) {
				return { ...note, completed: !note.completed };
			}
			return note;
		});
	}

	onMount(async () => {
		const res = await fetch("/api/tasks");
		notes = (await res?.json()) ?? [];
	});

	async function saveNotes() {
		await fetch("/api/tasks", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(notes),
		});
	}
</script>

<main>
	<div class="notes-container">
		{#each sortedNotes as note}
			<Task
				name={note.name}
				description={note.description}
				severity={note.severity}
				bind:completed={note.completed}
				onToggle={() => toggleNoteCompletion(notes.indexOf(note))}
			/>
		{/each}

		<div class="sticky-note new-note">
			<button>+</button>
		</div>
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	.notes-container {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.sticky-note.new-note {
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
		font-family: sans-serif;
		width: 250px;
		height: 150px;
		background-color: #eeeeee;
		border: 2px dashed #999;
		border-radius: 8px;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.sticky-note.new-note:hover {
		background-color: #ddd;
	}

	.sticky-note.new-note button {
		font-size: 2rem;
		background: none;
		border: none;
		cursor: pointer;
		color: #333;
	}
</style>
