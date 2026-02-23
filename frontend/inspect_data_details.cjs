const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectData() {
    console.log("--- INSPECTING DATA DETAILS ---");

    const { data, error } = await supabase
        .from('topics')
        .select('block')
        .limit(10);

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Found values:");
        const unique = [...new Set(data.map(d => d.block))];
        unique.forEach(val => {
            console.log(`Value: '${val}'`);
            console.log(`Length: ${val.length}`);
            console.log(`Char codes: ${val.split('').map(c => c.charCodeAt(0)).join(', ')}`);
        });
    }

    // Try to insert using the EXACT valid string from DB
    if (data && data.length > 0) {
        const validBlock = data[0].block;
        console.log(`Attempting insert with KNOWN VALID block: '${validBlock}'...`);

        const { error: insertError } = await supabase.from('topics').insert({
            id: '99999999-9999-9999-9999-999999999999',
            slug: 'test-insert-probe',
            name: 'Test Insert Probe',
            block: validBlock
        });

        if (insertError) {
            console.log(`❌ Insert failed even with valid value: ${insertError.message}`);
            console.log("This suggests the constraint depends on OTHER columns (e.g. slug format?) or global state.");
        } else {
            console.log("✅ Insert succeeded with existing value!");
            await supabase.from('topics').delete().eq('id', '99999999-9999-9999-9999-999999999999');
        }
    }
}

inspectData();
