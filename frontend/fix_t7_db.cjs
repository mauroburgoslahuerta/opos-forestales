
const { createClient } = require('@supabase/supabase-js');

// Service Key
const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fixT7() {
    console.log("Fixing T7 visibility...");
    const { data: t7 } = await supabase.from('topics').select('id').eq('slug', 't-com-7-discap').single();
    if (!t7) return console.error("T7 not found");

    // Set is_official = true for all questions in this topic
    const { error, count } = await supabase.from('questions')
        .update({ is_official: true })
        .eq('topic_id', t7.id)
        .select('id', { count: 'exact' });

    if (error) console.error("Error:", error);
    else console.log(`Updated ${count} questions in T7 to be official.`);
}

fixT7();
