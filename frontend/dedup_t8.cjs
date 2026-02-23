
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function dedupT8() {
    console.log("--- DEDUPLICATING T8 ---");
    const T8_ID = 'db7b32ff-3a81-48ed-8d4d-263f5a3b91cd';

    // Get all questions
    const { data: questions } = await supabase.from('questions')
        .select('id, question_text')
        .eq('topic_id', T8_ID);

    const textMap = {};
    const toDelete = [];

    questions.forEach(q => {
        const txt = q.question_text.trim();
        if (textMap[txt]) {
            // Duplicate found, mark for deletion
            toDelete.push(q.id);
        } else {
            // First time seeing this text, keep it
            textMap[txt] = q.id;
        }
    });

    console.log(`Total questions: ${questions.length}`);
    console.log(`Unique questions: ${Object.keys(textMap).length}`);
    console.log(`Duplicates to delete: ${toDelete.length}`);

    if (toDelete.length > 0) {
        // Delete in batches of 100
        for (let i = 0; i < toDelete.length; i += 100) {
            const batch = toDelete.slice(i, i + 100);
            const { error } = await supabase.from('questions').delete().in('id', batch);
            if (error) console.error("Error deleting batch:", error);
            else console.log(`Deleted batch ${i / 100 + 1}`);
        }
        console.log("Deduplication complete.");
    } else {
        console.log("No duplicates found.");
    }
}

dedupT8();
