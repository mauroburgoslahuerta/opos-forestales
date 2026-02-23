
const { createClient } = require('@supabase/supabase-js');

// Add your Supabase URL and Key here (Service Role Key)
const supabaseUrl = 'https://ercpodfgqayxewtapscn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkOptions() {
    const { data, error } = await supabase
        .from('questions')
        .select('id, correct_option, question_text')
        // Get questions from T3 (SEMOP) which was mentioned in the screenshot
        .ilike('question_text', '%SEMOP%')
        .limit(5);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('--- SAMPLE DATA ---');
    console.log(JSON.stringify(data, null, 2));
}

checkOptions();
