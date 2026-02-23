
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectCounts() {
    console.log("--- QUESTION COUNTS PER TOPIC ---");

    // Get all topics
    const { data: topics } = await supabase.from('topics').select('*').order('slug');

    let totalCommon = 0;
    let totalSpecific = 0;

    for (const t of topics) {
        // Count total questions
        const { count } = await supabase.from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('topic_id', t.id);

        console.log(`${t.slug.padEnd(25)} | ${t.name.substring(0, 40).padEnd(45)} | ${count}`);

        if (t.slug.startsWith('t-com-')) {
            totalCommon += count;
        } else {
            totalSpecific += count;
        }
    }

    console.log("-".repeat(80));
    console.log(`TOTAL COMMON:   ${totalCommon}`);
    console.log(`TOTAL SPECIFIC: ${totalSpecific}`);
    console.log(`GRAND TOTAL:    ${totalCommon + totalSpecific}`);
}

inspectCounts();
