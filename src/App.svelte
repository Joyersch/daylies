<script>
	import { onMount } from "svelte";
	import Node from "./Note.svelte";
	import NodeModal from "./NoteModal.svelte";

	let notes = JSON.parse(localStorage.getItem("notes") || "[]");

	let showModal = false;
	let currentEditNote = null;
	let editIndex = -1;

	const severityOrder = {
		critical: 0,
		high: 1,
		medium: 2,
		low: 3,
	};

	onMount(() => {
		const stored = JSON.parse(localStorage.getItem("notes") || "[]");
		notes = processStoredNotes(stored);
	});

	$: sortedNotes = (notes || [])
		.filter((n) => n && typeof n === "object")
		.sort((a, b) => {
			if (a.completed !== b.completed) return a.completed ? 1 : -1;
			return severityOrder[a.severity] - severityOrder[b.severity];
		});

	$: localStorage.setItem("notes", JSON.stringify(notes));

	function processStoredNotes(stored) {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		function getStartOfWeek(date) {
			const day = date.getDay();
			const diff = (day === 0 ? -6 : 1) - day;
			const monday = new Date(date);
			monday.setDate(date.getDate() + diff);
			monday.setHours(0, 0, 0, 0);
			return monday;
		}

		function getStartOfMonth(date) {
			const first = new Date(date.getFullYear(), date.getMonth(), 1);
			first.setHours(0, 0, 0, 0);
			return first;
		}

		notes = stored
			.map((note) => {
				if (!note.completed || !note.completedAt) {
					return note;
				}

				const completedAt = new Date(note.completedAt);
				completedAt.setHours(0, 0, 0, 0);

				const reset = note.resetOn || "n";

				let shouldReset = false;

				switch (reset) {
					case "d":
						shouldReset = completedAt < today;
						break;
					case "w":
						const weekStart = getStartOfWeek(today);
						shouldReset = completedAt < weekStart;
						break;
					case "m":
						const monthStart = getStartOfMonth(today);
						shouldReset = completedAt < monthStart;
						break;
					case "n":
						if (note.removeAfter === -1) {
							return note;
						}

						const expirationDate = new Date(completedAt);
						expirationDate.setDate(
							expirationDate.getDate() + note.removeAfter,
						);
						expirationDate.setHours(0, 0, 0, 0);

						if (expirationDate < today) {
							return;
						}

					default:
						shouldReset = false;
				}

				if (shouldReset) {
					return { ...note, completed: false, completedAt: null };
				}

				return note;
			})
			.filter((note) => note != null);

		return notes;
	}

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
			resetOn: "d",
			removeAfter: -1,
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

		background: #eeeeee;
		border: 2px dashed #999;
		font-size: 2rem;
		color: #333;
	}

	.sticky-note.new-note:hover {
		background-color: #e0e0e0;
	}
</style>
