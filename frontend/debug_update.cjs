
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugUpdate() {
    console.log('--- Debugging Update ---');
    const id = '1deb5ab0-8aa2-4825-9eda-6fa751d9ce49'; // From broken_questions.json

    // 1. Try no-op update
    console.log(`Attempting no-op update on ${id}`);
    const { error: err1 } = await supabase
        .from('questions')
        .update({ difficulty_level: 1 }) // No change effectively
        .eq('id', id)
        .select('id');

    if (err1) console.error("No-op update failed:", err1);
    else console.log("No-op update SUCCESS");

    // 2. Check triggers
    console.log('--- Checking Triggers ---');
    const { data: triggers, error: err2 } = await supabase
        .rpc('get_triggers', { table_name: 'questions' });
    // RPC might not exist, so let's try direct query if possible? 
    // Standard user cannot query information_schema usually via SDK directly unless exposed.
    // We'll try a raw select if disallowed.

    // fallback: try to just list triggers via SQL logic if possible, 
    // but without direct SQL access, I can't. 
    // warning: I don't have get_triggers RPC.
}

debugUpdate();
