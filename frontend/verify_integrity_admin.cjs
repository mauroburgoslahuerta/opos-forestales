const { createClient } = require('@supabase/supabase-js');

// CREDENCIALES DE ADMIN (Service Role) - Recuperadas de setup_auth.js
// Esto nos permite ver TODO, ignorando políticas RLS que podrían estar ocultando datos.
const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyIntegrity() {
    console.log("--- VERIFICACIÓN DE INTEGRIDAD (MODO ADMIN) ---");
    console.log("Conectando con Service Role Key (Bypass RLS)...");

    // 1. Conteo REAL de preguntas
    const { count, error: countError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error("❌ Error contando preguntas:", countError.message);
    } else {
        console.log(`\n🔎 TOTAL PREGUNTAS EN DB: ${count}`);
    }

    // 2. Agrupación por Topic ID (Para ver si están mal asignadas)
    // Traemos solo topic_id para contar en memoria y ver distribución
    const { data: questions, error: dataError } = await supabase
        .from('questions')
        .select('topic_id, question_text');

    if (dataError) {
        console.error("❌ Error descargando datos:", dataError.message);
        return;
    }

    const topicCounts = {};
    let nullTopics = 0;

    questions.forEach(q => {
        if (!q.topic_id) {
            nullTopics++;
        } else {
            topicCounts[q.topic_id] = (topicCounts[q.topic_id] || 0) + 1;
        }
    });

    console.log("\n📊 DISTRIBUCIÓN POR TOPIC_ID:");
    const sortedTopics = Object.entries(topicCounts).sort((a, b) => b[1] - a[1]);

    // Mostrar top 20
    sortedTopics.slice(0, 20).forEach(([id, c]) => {
        console.log(`   - ID: ${id} | Cantidad: ${c}`);
    });

    if (sortedTopics.length > 20) {
        console.log(`   ... y ${sortedTopics.length - 20} temas más.`);
    }

    console.log(`\n⚠️ Preguntas sin Topic ID (NULL): ${nullTopics}`);

    // Muestra de preguntas para verificar contenido
    console.log("\n👁️ MUESTRA DE 3 PREGUNTAS:");
    questions.slice(0, 3).forEach((q, i) => {
        console.log(`   ${i + 1}. [Topic: ${q.topic_id}] ${q.question_text.substring(0, 80)}...`);
    });
}

verifyIntegrity();
