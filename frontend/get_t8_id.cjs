
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function getID() {
    const { data } = await supabase.from('topics').select('id, slug').eq('slug', 't-com-8-prl').single();
    if (data) console.log(`FULL ID: ${data.id}`);
    else console.log("Not found");
}

getID();
