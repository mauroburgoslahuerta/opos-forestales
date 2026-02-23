
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('--- Checking Keys ---');
    const { data, error } = await supabase
        .from('questions')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Fetch Error select *:", error);
    } else if (data && data.length > 0) {
        Object.keys(data[0]).forEach(key => console.log(`Key: ${key}`));
    } else {
        console.log("No data found");
    }

    console.log('--- Testing explicit select correct_answer ---');
    const { data: d2, error: e2 } = await supabase
        .from('questions')
        .select('correct_answer')
        .limit(1);

    if (e2) {
        console.error("Fetch Error select correct_answer:", e2);
    } else {
        console.log("Success selecting correct_answer:", d2);
    }
}
checkSchema();
