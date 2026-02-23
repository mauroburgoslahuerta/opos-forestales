const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// ADMIN
const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
    const { data: topics } = await supabase.from('topics').select('id, name, slug');
    const { data: questions } = await supabase.from('questions').select('topic_id');

    const counts = {};
    questions.forEach(q => counts[q.topic_id] = (counts[q.topic_id] || 0) + 1);

    const lines = ["--- REPORTE FINAL ---"];
    Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50)
        .forEach(([tid, c]) => {
            const topic = topics.find(t => t.id === tid);
            const name = topic ? `[${topic.slug}] ${topic.name}` : "DELETE_ME";
            lines.push(`${c.toString().padStart(4)} -> ${name} (${tid})`);
        });

    fs.writeFileSync('topics_report.txt', lines.join('\n'));
    console.log("Reporte guardado en topics_report.txt");
}

run();
