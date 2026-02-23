const { createClient } = require('@supabase/supabase-js');

// CREDENCIALES DE ADMIN (Service Role)
const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function identifyTopics() {
    // IDs de la salida anterior
    const targetIds = [
        '808c27d6-5fd9-4150-b11c-391417ca6fa8', // Ajustado por posible corte
        '7a363adf-5d92-498c-9883-e09f9c500526'  // ID común visto antes
    ];

    console.log("--- IDENTIFICANDO TEMAS MASIVOS ---");

    // Traer todos los topics para mapear
    const { data: topics, error } = await supabase
        .from('topics')
        .select('id, name, slug');

    if (error) {
        console.error("Error fetching topics:", error);
        return;
    }

    // Traer conteos de nuevo para tener la lista fresca
    const { data: questions } = await supabase.from('questions').select('topic_id');
    const counts = {};
    questions.forEach(q => counts[q.topic_id] = (counts[q.topic_id] || 0) + 1);

    console.log("Torre de control de preguntas:");

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    sorted.slice(0, 20).forEach(([tid, count]) => {
        const topic = topics.find(t => t.id === tid);
        const name = topic ? `[${topic.slug}] ${topic.name}` : "❌ DESCONOCIDO / BORRADO";
        console.log(`${count.toString().padStart(4)} preguntas -> ${name} (${tid})`);
    });
}

identifyTopics();
