__skipAutoReset = true;

const today = new Date();
today.setHours(0, 0, 0, 0);

const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

const lastSunday = new Date(today);
lastSunday.setDate(today.getDate() - today.getDay() - 1);

const firstOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

const fourDays = new Date(today);
fourDays.setDate(today.getDate() - 4);

const testNotes = [
    {
        name: "Daily Reset",
        description: "Should reset today (daily)",
        severity: "low",
        completed: true,
        completedAt: yesterday.toISOString(),
        resetOn: "d",
        removeAfter: -1,
    },
    {
        name: "Weekly Reset",
        description: "Should reset today (weekly)",
        severity: "low",
        completed: true,
        completedAt: lastSunday.toISOString(),
        resetOn: "w",
        removeAfter: -1,
    },
    {
        name: "Monthly Reset",
        description: "Should reset today (monthly)",
        severity: "low",
        completed: true,
        completedAt: firstOfLastMonth.toISOString(),
        resetOn: "m",
        removeAfter: -1,
    },
    {
        name: "Never Reset, Should Be Removed",
        description: "Should be removed today (removeAfter = 3 days)",
        severity: "low",
        completed: true,
        completedAt: fourDays.toISOString(),
        resetOn: "n",
        removeAfter: 3,
    }
];

const existing = JSON.parse(localStorage.getItem("notes") ?? "[]");

localStorage.setItem("notes", JSON.stringify([...existing, ...testNotes]));

console.log("Test notes added:", testNotes);
