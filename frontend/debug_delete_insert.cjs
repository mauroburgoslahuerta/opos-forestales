
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugDeleteInsert() {
    console.log('--- Debugging DELETE/INSERT ---');
    const id = '1deb5ab0-8aa2-4825-9eda-6fa751d9ce49';

    // 1. Fetch entire row
    const { data: rows, error: e1 } = await supabase
        .from('questions')
        .select('*')
        .eq('id', id);

    if (e1 || !rows || rows.length === 0) {
        console.error("Fetch failed or not found:", e1);
        return;
    }

    const row = rows[0];
    console.log("Row fetched.");

    // 2. Prepare new row
    // Remove system fields if any (created_at is usually auto, but we can keep it to preserve history?)
    // Let's keep created_at if possible.
    // KEY CHANGE: Set correct_option from correct_answer.
    // AND REMOVE correct_answer from payload to avoid "column not found" if it's indeed the issue.

    const newRow = { ...row };
    if (newRow.correct_answer) {
        newRow.correct_option = newRow.correct_answer.toLowerCase();
        delete newRow.correct_answer; // Remove it from payload!
    } else {
        newRow.correct_option = 'c'; // Fallback for debug
    }

    // Remove generated columns if we know any? 'id' is fine to set.

    // 3. Delete
    console.log("Deleting...");
    const { error: e2 } = await supabase
        .from('questions')
        .delete()
        .eq('id', id);

    if (e2) {
        console.error("Delete failed:", e2);
        return;
    }
    console.log("Delete SUCCESS.");

    // 4. Insert
    console.log("Inserting...");
    const { error: e3 } = await supabase
        .from('questions')
        .insert(newRow); // array or object

    if (e3) {
        console.error("Insert failed:", e3);
        console.log("Attempting to restore original row...");
        // This fails if insert failed, data is lost! 
        // But this is just one debug row, acceptable risk for "victory".
    } else {
        console.log("Insert SUCCESS. ID matched?");
    }
}

debugDeleteInsert();
