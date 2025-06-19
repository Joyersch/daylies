<script>
	import { onMount } from "svelte";
	import Node from "./Note.svelte";
	import NodeModal from "./NoteModal.svelte";

	let notes = JSON.parse(localStorage.getItem("notes") ?? "[]");

	let showModal = false;
	let currentEditNote = null;
	let editIndex = -1;

	const severityOrder = {
		critical: 0,
		high: 1,
		medium: 2,
		low: 3,
	};

	onMount(() => {});

	$: sortedNotes = [...notes].sort((a, b) => {
		if (a.completed !== b.completed) return a.completed ? 1 : -1;
		return severityOrder[a.severity] - severityOrder[b.severity];
	});

	$: localStorage.setItem("notes", JSON.stringify(notes));

	function toggleNoteCompletion(index, update) {
		notes = notes.map((note, i) => {
			if (i === index) {
				return update;
			}
			return note;
		});
	}

	function openNewNoteModal() {
		currentEditNote = {
			name: "",
			description: "",
			severity: "low",
			completed: false,
			completedAt: null,
		};
		editIndex = -1;
		showModal = true;
	}

	function openEditNoteModal(note, index) {
		currentEditNote = note;
		editIndex = index;
		showModal = true;
	}

	function saveNote(note) {
		if (editIndex == -1) {
			showModal = false;
			notes = [...notes, note];
			return;
		}

		notes[editIndex] = { ...note };
		showModal = false;
	}

	function cancelModal() {
		showModal = false;
	}

	function removeNote(noteToRemove) {
		notes = notes.filter((note) => note !== noteToRemove);
	}
</script>

<main>
	<div class="notes-container">
		{#each sortedNotes as note, i}
			<Node
				name={note.name}
				description={note.description}
				severity={note.severity}
				completedAt={note.completedAt}
				completed={note.completed}
				on:complete={(e) =>
					toggleNoteCompletion(notes.indexOf(note), e.detail)}
				on:delete={() => removeNote(note)}
				on:edit={() => openEditNoteModal(note, notes.indexOf(note))}
			/>
		{/each}

		<button class="sticky-note new-note" on:click={openNewNoteModal}>
			+
		</button>
	</div>
	<NodeModal
		show={showModal}
		note={currentEditNote}
		on:save={(e) => saveNote(e.detail)}
		on:cancel={cancelModal}
	/>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
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
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		transition: background-color 0.2s;

		/* Reset button styles */
		background: #eeeeee;
		border: 2px dashed #999;
		font-size: 2rem;
		color: #333;
	}

	.sticky-note.new-note:hover {
		background-color: #e0e0e0;
	}
</style>
