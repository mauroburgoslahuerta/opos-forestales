
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkFlags() {
    const { data: topic } = await supabase.from('topics').select('id').eq('slug', 't-com-7-discap').single();
    if (!topic) return console.log("Topic t-com-7-discap not found");

    const { data: questions } = await supabase.from('questions')
        .select('id, is_official, source_file')
        .eq('topic_id', topic.id)
        .limit(5);

    console.log("Sample T7 Questions:", questions);
}

checkFlags();
