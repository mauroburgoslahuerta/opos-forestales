
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function restoreAnswers() {
    console.log('--- Restoring answers from broken_questions.json (Minimal Return) ---');

    // Read JSON
    const data = JSON.parse(fs.readFileSync('broken_questions.json', 'utf-8'));
    console.log(`Loaded ${data.length} questions from JSON.`);

    let updatedCount = 0;

    for (const q of data) {
        const newVal = q.correct_answer ? q.correct_answer.trim().toLowerCase() : null;

        if (newVal && ['a', 'b', 'c', 'd'].includes(newVal)) {
            // Explicitly select only ID to avoid schema cache validation on full row
            const { error } = await supabase
                .from('questions')
                .update({ correct_option: newVal })
                .eq('id', q.id)
                .select('id');

            if (error) {
                console.error(`Error updating ${q.id}:`, error.message);
            } else {
                updatedCount++;
                if (updatedCount % 50 === 0) process.stdout.write('.');
            }
        }
    }
    console.log(`\nRestoration complete. Updated ${updatedCount} questions.`);
}

restoreAnswers();
