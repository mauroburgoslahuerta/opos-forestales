
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    // Testing which columns actually exist via targeted selects
    const testColumns = ['id', 'correct_option', 'correct_answer', 'explanation', 'source_file'];

    for (const col of testColumns) {
        const { error } = await supabase.from('questions').select(col).limit(1);
        if (error) {
            console.log(`Column '${col}' DOES NOT EXIST (Error: ${error.message})`);
        } else {
            console.log(`Column '${col}' EXISTS`);
        }
    }
}
checkSchema();
