const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// ADMIN
const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function report() {
    try {
        console.log("Iniciando...");
        const output = [];

        // 1. Total
        const { count, error } = await supabase.from('questions').select('*', { count: 'exact', head: true });
        if (error) throw error;
        output.push(`TOTAL PREGUNTAS: ${count}`);

        // 2. Por Tema
        const { data: questions } = await supabase.from('questions').select('topic_id');
        const counts = {};
        questions.forEach(q => counts[q.topic_id] = (counts[q.topic_id] || 0) + 1);

        const { data: topics } = await supabase.from('topics').select('id, name, slug');

        output.push("\n--- DESGLOSE POR TEMA (TOP 50) ---");
        Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 50)
            .forEach(([tid, c]) => {
                const t = topics.find(x => x.id === tid);
                const name = t ? t.name : "DESCONOCIDO";
                const slug = t ? t.slug : "???";
                output.push(`${c.toString().padEnd(4)} | [${slug}] ${name} (${tid})`);
            });

        const filePath = path.join(__dirname, 'final_report.txt');
        fs.writeFileSync(filePath, output.join('\n'));
        console.log("Reporte escrito en: " + filePath);

    } catch (e) {
        console.error(e);
        fs.writeFileSync('final_report_error.txt', e.message);
    }
}

report();
