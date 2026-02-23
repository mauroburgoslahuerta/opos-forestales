
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectSources() {
    console.log("--- SOURCES PER TOPIC (COMMON) ---");

    const { data: topics } = await supabase.from('topics')
        .select('id, slug, name')
        .ilike('slug', 't-com-%')
        .order('slug');

    for (const t of topics) {
        // Group by source_file
        const { data: questions } = await supabase.from('questions')
            .select('source_file')
            .eq('topic_id', t.id);

        const sources = {};
        questions.forEach(q => {
            const src = q.source_file || 'Unknown';
            sources[src] = (sources[src] || 0) + 1;
        });

        console.log(`\nTOPIC: ${t.slug} (${questions.length} total)`);
        Object.entries(sources).forEach(([src, count]) => {
            console.log(`  - ${src}: ${count}`);
        });
    }
}

inspectSources();
