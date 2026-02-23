const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkCounts() {
    console.log("=== AUDITORÍA POST-INSERCIÓN BBDD ===");

    // Contar total global
    const { count: totalQuestions, error: errTotal } = await supabase.from('questions').select('*', { count: 'exact', head: true });
    if (errTotal) { console.error(errTotal); return; }

    console.log(`TOTAL PREGUNTAS EN BBDD: ${totalQuestions} (Esperado: 1280)`);
    console.log("Desglose por Tema:");

    // Traer todos los temas
    const { data: topics, error: errTopics } = await supabase.from('topics').select('id, name, slug').order('slug');
    if (errTopics) { console.error(errTopics); return; }

    for (let t of topics) {
        const { count: topicCount, error: errQ } = await supabase
            .from('questions')
            .select('*', { count: 'exact', head: true })
            .eq('topic_id', t.id);

        if (topicCount > 0) {
            console.log(` - [${t.slug}] ${t.name}: ${topicCount} preguntas`);
        } else {
            console.log(` - [${t.slug}] ${t.name}: ❗️ 0 preguntas`);
        }
    }
}

checkCounts();
