
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ercpofgqayxewtapscsn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTopicKeys() {
    const { data, error } = await supabase.from('topics').select('*').limit(1);
    if (error) {
        console.error("select * FAIL:", error);
    } else if (data && data.length > 0) {
        console.log("COLUMNS FOUND IN TOPICS ROW:");
        Object.keys(data[0]).sort().forEach(k => console.log(`- ${k}`));
    } else {
        console.log("No rows found in topics.");
    }
}
checkTopicKeys();
