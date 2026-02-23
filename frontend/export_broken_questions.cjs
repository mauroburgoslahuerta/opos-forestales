
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportBroken() {
    console.log('--- Exporting broken questions ---');

    const { data: allQuestions, error } = await supabase
        .from('questions')
        .select('id, topic_id, question_text, option_a, option_b, option_c, option_d');

    if (error) { console.error(error); return; }

    // Filter purely in JS to avoid any query builder issues
    // We want questions where correct_option is NULL or empty
    // But we didn't select correct_option in the query above? Wait.
    // I need to select correct_option to check if it's broken.

    const { data: fullData, error: fullError } = await supabase
        .from('questions')
        .select('*');

    if (fullError) { console.error(fullError); return; }

    const broken = fullData.filter(q => !q.correct_option || q.correct_option === '?' || q.correct_option === '');

    console.log(`Found ${broken.length} broken questions.`);

    fs.writeFileSync('broken_questions.json', JSON.stringify(broken, null, 2));
    console.log('Saved to broken_questions.json');
}

exportBroken();
