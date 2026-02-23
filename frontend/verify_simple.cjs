const { createClient } = require('@supabase/supabase-js');

// CREDENCIALES DE ADMIN (Service Role)
const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verify() {
    try {
        // 1. Conteo Total
        const { count, error } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true });

        if (error) throw error;

        console.log(`TOTAL_PREGUNTAS_DB: ${count}`);

        // 2. Conteo por Topic ID
        const { data, error: dataError } = await supabase
            .from('questions')
            .select('topic_id');

        if (dataError) throw dataError;

        const counts = {};
        data.forEach(q => counts[q.topic_id] = (counts[q.topic_id] || 0) + 1);

        console.log("TOPICS_ENCONTRADOS:");
        Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10) // Top 10
            .forEach(([id, num]) => console.log(`${id}: ${num}`));

    } catch (e) {
        console.error("ERROR:", e.message);
    }
}

verify();
