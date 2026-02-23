
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function deleteTSeguridade() {
    console.log("Deleting t-seguridade (duplicate T8)...");
    const ID = 'bb271092-93ad-4b92-6747-5285b1fd2d55';

    // First delete questions to avoid FK constraint issues (if cascade not set)
    // Actually, we want to KEEP questions if they are the only copy?
    // NO, we have 340 questions in t-com-8-prl.
    // t-seguridade has 341.
    // We can delete t-seguridade safely.

    // Check if cascade delete is enabled on FK?
    // Safer to delete questions first.

    const { count, error: qErr } = await supabase.from('questions').delete().eq('topic_id', ID).select('*', { count: 'exact', head: true });

    if (qErr) {
        console.error("Error deleting questions:", qErr);
        return;
    }
    console.log(`Deleted ${count} questions from t-seguridade.`);

    const { error } = await supabase.from('topics').delete().eq('id', ID);

    if (error) console.error("Error deleting topic:", error);
    else console.log("Deleted topic t-seguridade.");
}

deleteTSeguridade();
