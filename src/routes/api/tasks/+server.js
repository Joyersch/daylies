import fs from 'fs/promises';
const filePath = 'data/tasks.json';

export async function GET() {
    const data = await fs.readFile(filePath, 'utf-8');
    return new Response(data, {
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function POST({ request }) {
    const updatedTasks = await request.json();
    await fs.writeFile(filePath, JSON.stringify(updatedTasks, null, 2));
    return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
    });
}
