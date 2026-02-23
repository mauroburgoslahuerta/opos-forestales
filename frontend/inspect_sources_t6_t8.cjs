
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspectSourcesFiltered() {
    console.log("--- SOURCES PER TOPIC (T6 & T8) ---");

    const { data: topics } = await supabase.from('topics')
        .select('id, slug, name')
        .or('slug.eq.t-com-6-igualdade,slug.eq.t-com-8-prl');

    for (const t of topics) {
        const { data: questions } = await supabase.from('questions')
            .select('source_file')
            .eq('topic_id', t.id);

        const sources = {};
        questions.forEach(q => {
            const src = q.source_file || 'Unknown';
            sources[src] = (sources[src] || 0) + 1;
        });

        const sortedSources = Object.entries(sources).sort((a, b) => b[1] - a[1]);

        console.log(`\nTOPIC: ${t.slug} (${questions.length} total)`);
        sortedSources.forEach(([src, count]) => {
            console.log(`  [${count.toString().padStart(3)}] "${src}"`);
        });
    }
}

inspectSourcesFiltered();
