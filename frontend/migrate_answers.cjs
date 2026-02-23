
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateAnswers() {
    console.log('--- Migrating correct_answer to correct_option (Explicit Select) ---');

    // Explicitly select columns to avoid schema cache confusion
    const { data: questions, error } = await supabase
        .from('questions')
        .select('id, correct_answer, correct_option');

    if (error) { console.error("Error fetching:", error); return; }

    console.log(`Fetched ${questions.length} questions.`);

    let updatedCount = 0;

    for (const q of questions) {
        // Condition: correct_option is bad, but correct_answer is good
        const optionBad = !q.correct_option || q.correct_option === '?' || q.correct_option === '';
        const answerGood = q.correct_answer && q.correct_answer !== '' && q.correct_answer !== '?';

        if (optionBad && answerGood) {
            const newVal = q.correct_answer.trim().toLowerCase();

            if (['a', 'b', 'c', 'd'].includes(newVal)) {
                const { error: updateError } = await supabase
                    .from('questions')
                    .update({ correct_option: newVal })
                    .eq('id', q.id);

                if (updateError) {
                    console.error(`Failed to update ${q.id}:`, updateError);
                } else {
                    updatedCount++;
                    if (updatedCount % 50 === 0) process.stdout.write('.');
                }
            }
        }
    }

    console.log(`\nMigration complete. Updated ${updatedCount} questions.`);
}

migrateAnswers();
