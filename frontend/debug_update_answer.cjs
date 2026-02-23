
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDependencies() {
    console.log('--- Debugging correct_answer Update ---');
    const id = '1deb5ab0-8aa2-4825-9eda-6fa751d9ce49';

    // 1. Try updating correct_answer
    const { error: e1 } = await supabase.from('questions')
        .update({ correct_answer: 'c' })
        .eq('id', id).select('id');

    if (e1) console.error("Update Answer Error:", e1);
    else console.log("Update Answer Success");

    // 2. Check for potential dependent tables
    // We can't query foreign keys easily without SQL.
    // But we can check if 'user_answers' or 'test_results' exist.
    const tables = ['user_answers', 'test_results', 'exam_results', 'answers'];
    console.log('--- Checking Tables ---');

    for (const t of tables) {
        const { error } = await supabase.from(t).select('*').limit(1);
        if (!error) console.log(`Table '${t}' exists.`);
        else console.log(`Table '${t}' likely does not exist (Error: ${error.code})`);
    }
}

checkDependencies();
