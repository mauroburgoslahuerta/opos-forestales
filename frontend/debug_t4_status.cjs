
const { createClient } = require('@supabase/supabase-js');

// Hardcoded for debugging
const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTIwNjcsImV4cCI6MjA4NjY2ODA2N30.Ro3og1p-9E1TtG__K6Tvd5gU9wfgUu2BkEMuW5qFtlI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugT4() {
    console.log("🔍 Inspecting T4 Questions...");

    // T4 ID from registry/debug output
    const T4_ID = 'a9abe9a1-c783-484b-95c7-d8417ca6fa8c';

    const { data: questions, error } = await supabase
        .from('questions')
        .select('id, is_official, source_file')
        .eq('topic_id', T4_ID);

    if (error) {
        console.error("Error fetching T4:", error);
        return;
    }

    console.log(`Found ${questions.length} questions for T4.`);

    const officialCount = questions.filter(q => q.is_official).length;
    console.log(`Official: ${officialCount}`);
    console.log(`Unofficial: ${questions.length - officialCount}`);

    if (questions.length > 0) {
        console.log("Sample question:", questions[0]);
    }
}

debugT4();
