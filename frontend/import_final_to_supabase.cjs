const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// --- CREDENTIALS ---
const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
// Usamos el service_role key recabado para sortear politicas RLS
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const jsonPath = path.join(__dirname, '../preguntas_gemini_finalizadas.json');

// --- UTILS ---
const REPLACEMENTS = {
    'Ɵ': 'ti',
    'İ': 'fi',
    'ﬁ': 'fi',
    'ﬂ': 'fl',
    '’': "'",
    '“': '"',
    '”': '"'
};

function cleanText(text) {
    if (!text) return text;
    let cleaned = text.toString();
    for (const [bad, good] of Object.entries(REPLACEMENTS)) {
        cleaned = cleaned.split(bad).join(good);
    }
    cleaned = cleaned.replace(/\n/g, ' ');
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    return cleaned;
}

function normalizeCorrectAnswer(ans) {
    if (!ans) return null;
    return ans.toLowerCase().trim().replace(/[\)\.]/g, '');
}

async function run() {
    try {
        console.log("=== INICIANDO IMPORTACION MASTER A SUPABASE ===");

        if (!fs.existsSync(jsonPath)) {
            throw new Error(`Archivo no encontrado: ${jsonPath}`);
        }

        const questionsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        console.log(`Leídas ${questionsData.length} preguntas validadas de Gemini.`);

        const BATCH_SIZE = 50;
        let batch = [];
        let totalImported = 0;
        let totalErrors = 0;

        for (let i = 0; i < questionsData.length; i++) {
            const q = questionsData[i];

            // Safety filter: ensure valid CA
            const cleanCorrect = normalizeCorrectAnswer(q.correct_answer);
            if (!['a', 'b', 'c', 'd'].includes(cleanCorrect)) {
                console.warn(`Saltando pregunta ${i} por respuesta invalida: ${cleanCorrect}`);
                continue;
            }

            // Map nested options to flat columns
            const opts = q.options || {};

            const explanationText = q.explanation ? cleanText(q.explanation) : '';

            batch.push({
                topic_id: q.topic_id,
                question_text: cleanText(q.question_text),
                option_a: cleanText(opts['a'] || ''),
                option_b: cleanText(opts['b'] || ''),
                option_c: cleanText(opts['c'] || ''),
                option_d: cleanText(opts['d'] || ''),
                correct_answer: cleanCorrect,
                explanation: explanationText,
                source_file: q.source || 'Importación Gemini 2.5',
                is_official: true
            });

            if (batch.length >= BATCH_SIZE) {
                const errors = await upsertBatch(batch);
                if (!errors) {
                    totalImported += batch.length;
                } else {
                    totalErrors += batch.length;
                }
                batch = [];
            }
        }

        if (batch.length > 0) {
            const errors = await upsertBatch(batch);
            if (!errors) {
                totalImported += batch.length;
            } else {
                totalErrors += batch.length;
            }
        }

        console.log(`\n=== IMPORTACIÓN FINALIZADA ===`);
        console.log(`📚 Preguntas Insertadas: ${totalImported}`);
        if (totalErrors > 0) console.log(`❌ Errores en Lotes: ${totalErrors}`);

    } catch (e) {
        console.error("Critical Error:", e);
    }
}

async function upsertBatch(batch) {
    const { error } = await supabase.from('questions').insert(batch);
    if (error) {
        console.error("\nBatch error:", JSON.stringify(error, null, 2));
        return true; // Has errors
    } else {
        process.stdout.write("📦 ");
        return false;
    }
}

run();
