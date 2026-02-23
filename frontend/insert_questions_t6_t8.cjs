
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// --- CONFIG ---
// Found in frontend/check_rls.cjs
const SUPABASE_URL = "https://ercpofgqayxewtapscsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3BvZmdxYXl4ZXd0YXBzY3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA5MjA2NywiZXhwIjoyMDg2NjY4MDY3fQ.8zzVRwTG7e9uG_Z9DJxWcnVcdvdXx2-cCEumlTHnfRk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const jsonPathT6 = path.join(__dirname, '../Test alumnos lei de igualdade_parsed.json');
const jsonPathT8 = path.join(__dirname, '../T8_PRL_parsed.json');

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
    let cleaned = text;
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
        console.log("Starting import...");

        // 1. Get Topic IDs
        const { data: topicT6, error: errT6 } = await supabase.from('topics').select('id').eq('slug', 't-com-6-igualdade').single();
        const { data: topicT8, error: errT8 } = await supabase.from('topics').select('id').eq('slug', 't-seguridade').single();

        if (errT6 || !topicT6) throw new Error("Topic T6 (t-com-6-igualdade) not found");
        if (errT8 || !topicT8) throw new Error("Topic T8 (t-seguridade) not found");

        const T6_ID = topicT6.id;
        const T8_ID = topicT8.id;

        console.log(`T6 ID: ${T6_ID}`);
        console.log(`T8 ID: ${T8_ID}`);

        // 2. Load Questions
        let questions = [];
        if (fs.existsSync(jsonPathT6)) {
            const t6 = JSON.parse(fs.readFileSync(jsonPathT6, 'utf8'));
            console.log(`Loaded ${t6.length} questions for T6`);
            questions = questions.concat(t6);
        }
        if (fs.existsSync(jsonPathT8)) {
            const t8 = JSON.parse(fs.readFileSync(jsonPathT8, 'utf8'));
            console.log(`Loaded ${t8.length} questions for T8`);
            questions = questions.concat(t8);
        }

        // 3. Prepare Batches
        const BATCH_SIZE = 50;
        let batch = [];
        let totalImported = 0;

        for (const q of questions) {
            // Determine Topic ID
            let topicId = T6_ID;
            let explanationPrefix = 'Lei 7/2023';

            if (q.topic_slug === 't-com-8-prl') {
                topicId = T8_ID;
                explanationPrefix = 'Lei 31/1995 PRL';
            }

            // Filtering
            if (!q.question_text || !q.correct_answer || q.question_text.length < 5) continue;
            const cleanCorrect = normalizeCorrectAnswer(q.correct_answer);
            if (!['a', 'b', 'c', 'd'].includes(cleanCorrect)) continue;

            const explanation = `Referencia oficial: ${explanationPrefix}. (Fuente: ${q.source_file})`;

            batch.push({
                topic_id: topicId,
                question_text: cleanText(q.question_text),
                option_a: cleanText(q.option_a || ''),
                option_b: cleanText(q.option_b || ''),
                option_c: cleanText(q.option_c || ''),
                option_d: cleanText(q.option_d || ''),
                correct_answer: cleanCorrect,
                explanation: explanation,
                source_file: q.source_file,
                is_official: true
            });

            if (batch.length >= BATCH_SIZE) {
                await upsertBatch(batch);
                totalImported += batch.length;
                batch = [];
            }
        }

        if (batch.length > 0) {
            await upsertBatch(batch);
            totalImported += batch.length;
        }

        console.log(`DONE. Imported ${totalImported} questions.`);

    } catch (e) {
        console.error("Critical Error:", e);
    }
}

async function upsertBatch(batch) {
    // Try simple insert. If duplicates exist, it might fail if there's a constraint.
    const { error } = await supabase.from('questions').insert(batch);

    if (error) {
        console.error("Batch error:", JSON.stringify(error, null, 2));
    } else {
        process.stdout.write(".");
    }
}

run();
